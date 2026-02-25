import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { Product } from 'graphql-utils';
import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';

import ManualBarcodeForm from '@/components/ManualBarcodeForm';
import ProductForm from '@/components/product-form/ProductForm';
import ScannerOverlay from '@/components/scanner/ScannerOverlay';
import Btn from '@/components/ui/Btn';
import Button from '@/components/ui/Button';
import ModalFormFull from '@/components/ui/ModalFormFull';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { barcodeTypes } from '@/constants/barcodeTypes';
import useAddProductPrompt from '@/hooks/useAddProductPrompt';

export default function ScanScreen() {
  const router = useRouter();
  const {
    handleBarcodeScan,
    extractingProduct,
    processingBarcode,
    handleExtractionImage,
    extractProductFromImagePrompt,
  } = useAddProductPrompt();
  const [renderCameraComponent, setRenderCameraComponent] = useState(false);
  const [, setCamera] = useState<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string>();
  const [openManualBarcodeModal, setOpenManualBarcodeModal] = useState(false);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);

  const debouncedHandleBarcodeScan = useMemo(
    () => debounce(_handleBarcodeScan, 1000, { leading: true, trailing: false }),
    []
  );

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => setRenderCameraComponent(true), 1000);

      return () => {
        setRenderCameraComponent(false);
      };
    }, [])
  );

  if (!permission) return <View />; // Camera permissions are still loading

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex h-full w-full flex-col items-center justify-center gap-10 p-10">
        <Text className="text-center">We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>Grant permission</Button>
      </View>
    );
  }

  function toProductPage(productId: number, stockId?: number) {
    const p = new URLSearchParams();
    if (stockId) p.append('stockId', String(stockId));
    router.push(`/(tabs)/(products)/${productId}?${p.toString()}`, { relativeToDirectory: false });
  }

  async function _handleBarcodeScan(barcode: string, searchMode?: boolean) {
    setScannedCode(barcode);

    handleBarcodeScan(barcode, {
      onSuccess: (data) => toProductPage(data.barcodeScan.id, data.barcodeScan.stock?.id),
      onError: () => {
        setRenderCameraComponent(false);
        Alert.alert(
          'The barcode you scanned does not exist in our database',
          'You can help us record and track prices for this product by taking a picture',
          extractProductFromImagePrompt({
            onTakePicture: () => {
              handleExtractionImage(barcode, {
                onSuccess: (data) => toProductPage(data.extractAndCreateProduct.id),
                onError: () => {
                  setRenderCameraComponent(true);
                  Alert.alert(
                    'Error extracting product data',
                    'Please try again or add the product manually'
                  );
                  setOpenCreateProductModal(true);
                },
              });
            },
            onAddManually: () => {
              setOpenCreateProductModal(true);
            },
            onCancel: () => {
              setRenderCameraComponent(true);
            },
          })
        );
      },
    });
  }

  if (extractingProduct) {
    return (
      <View className="flex h-full w-full flex-col items-center justify-center gap-10 p-10">
        <ActivityIndicator color="black" size="large" />
        <Text className="text-center">Extracting product data.</Text>
        <Text className="text-center">
          This might take a few minutes depending on your network speed
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ModalFormMini
        visible={openManualBarcodeModal}
        noPadding
        onRequestClose={() => {
          setOpenManualBarcodeModal(false);
          setRenderCameraComponent(true);
        }}
        icon={<Ionicons name="search" size={24} color="black" />}
        title="Search Products">
        <ManualBarcodeForm onDismiss={() => setOpenManualBarcodeModal(false)} />
      </ModalFormMini>

      {scannedCode && openCreateProductModal && (
        <ModalFormFull
          visible={openCreateProductModal}
          onRequestClose={() => {
            setOpenCreateProductModal(false);
            setRenderCameraComponent(true);
          }}
          title="Create Product">
          <ProductForm
            upc={scannedCode.replaceAll('*', '')}
            product={
              {
                code: scannedCode.replaceAll('*', ''),
              } as Product
            }
            onCancel={({ resetForm }) => {
              resetForm();
              setOpenCreateProductModal(false);
              setRenderCameraComponent(true);
            }}
            onSuccess={({ id }, { resetForm }) => {
              resetForm();
              router.replace(`/(tabs)/(products)/${id}`);
              setOpenCreateProductModal(false);
            }}
            onError={(err) => Alert.alert(err.name, err.message)}
          />
        </ModalFormFull>
      )}

      {renderCameraComponent && (
        <CameraView
          ratio="1:1"
          style={{
            flex: 1,
          }}
          facing="back"
          autofocus="off"
          ref={(ref) => setCamera(ref)}
          barcodeScannerSettings={{
            barcodeTypes,
          }}
          onMountError={(e) => Alert.alert('Camera mount error', e.message)}
          onBarcodeScanned={async (res) => {
            debouncedHandleBarcodeScan(res.data, undefined);
          }}
        />
      )}

      {renderCameraComponent && (
        <>
          {processingBarcode ? (
            <View className="absolute z-10 flex h-full w-full items-center justify-center">
              <View className="flex flex-col items-center justify-center rounded-xl bg-black/50 px-10 py-7">
                <ActivityIndicator color="white" size="large" />
                <Text className="mt-4 text-white">Processing Barcode</Text>
              </View>
            </View>
          ) : (
            <ScannerOverlay />
          )}
        </>
      )}

      <View className="absolute bottom-0 z-10 w-full rounded-t-3xl bg-black px-5 py-7">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-2xl font-bold color-white">Scan Barcode</Text>

          <TouchableOpacity onPress={() => router.back()} className="p-3">
            <AntDesign name="close" size={25} color="white" />
          </TouchableOpacity>
        </View>

        <View className="my-5">
          <Text className="color-white">Point your camera at the product barcode to search</Text>

          <View className="mt-5 flex flex-row">
            <Btn
              text="Use Keyboard"
              size="sm"
              color="text-white"
              bgColor="bg-[#111]"
              onPress={() => {
                setTimeout(() => setRenderCameraComponent(false), 1000);
                setOpenManualBarcodeModal(true);
              }}
              icon={<MaterialIcons name="keyboard" size={24} color="white" />}
            />

            <View className="flex-1" />
          </View>
        </View>
      </View>
    </View>
  );
}
