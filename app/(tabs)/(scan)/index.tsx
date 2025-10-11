import { useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, AlertButton, Text, TouchableOpacity, View } from 'react-native';

import ManualBarcodeForm from '@/components/ManualBarcodeForm';
import ProductForm, {
  selectImageForProductExtraction,
} from '@/components/product-form/ProductForm';
import ScannerOverlay from '@/components/scanner/ScannerOverlay';
import Button from '@/components/ui/Button';
import ModalFormFull from '@/components/ui/ModalFormFull';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { barcodeTypes } from '@/constants/barcodeTypes';
import { useAuth } from '@/context/UserContext';
import {
  BarcodeScanDocument,
  ExtractAndCreateProductDocument,
  Product,
  UserRole,
} from '@/graphql/types/graphql';
import { isRoleAuthorized } from '@/lib/roles';

export default function ScanScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [renderCameraComponent, setRenderCameraComponent] = useState(false);
  const [, setCamera] = useState<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string>();
  const [openManualBarcodeModal, setOpenManualBarcodeModal] = useState(false);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);

  const [barcodeScan] = useLazyQuery(BarcodeScanDocument);
  const [extractProductFields, { loading: extractingProduct }] = useMutation(
    ExtractAndCreateProductDocument
  );

  const debouncedHandleBarcodeScan = useMemo(
    () => debounce(_handleBarcodeScan, 1000, { leading: true, trailing: false }),
    []
  );

  useFocusEffect(
    useCallback(() => {
      setRenderCameraComponent(true);

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

  function toProductPage(productId: number) {
    router.push(`/(tabs)/(products)/${productId}`, { relativeToDirectory: false });
  }

  function _handleBarcodeScan(barcode: string, searchMode?: boolean) {
    setScannedCode(barcode);

    barcodeScan({
      variables: { barcode, searchMode },
    }).then(({ error, data }) => {
      if (!error && data) {
        return toProductPage(data.barcodeScan.id);
      }

      setRenderCameraComponent(false);
      const alertButtons: AlertButton[] = [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setRenderCameraComponent(true);
          },
        },
      ];
      if (isRoleAuthorized(UserRole.Contributor, user.role)) {
        alertButtons.push({
          text: 'Add Manually',
          style: 'default',
          onPress: () => {
            setOpenCreateProductModal(true);
          },
        });
      }
      alertButtons.push({
        text: 'Take Picture',
        style: 'default',
        isPreferred: true,
        onPress: async () => {
          const pic = await selectImageForProductExtraction(true, 0);
          if (!pic) {
            setRenderCameraComponent(true);
            return;
          }

          extractProductFields({
            variables: { barcode: barcode.replaceAll('*', ''), base64Image: pic.base64 },
          })
            .then(async ({ data }) => {
              if (!data) throw new Error('could not extract data');

              toProductPage(data.extractAndCreateProduct.id);
            })
            .catch((_err) => {
              setRenderCameraComponent(true);
              Alert.alert(
                'Error extracting product data',
                'Please try again or add the product manually'
              );
              setOpenCreateProductModal(true);
            });
        },
      });

      Alert.alert(
        'The barcode you scanned does not exist in our database',
        'You can help us record and track prices for this product by taking a picture',
        alertButtons
      );
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <ModalFormMini
        visible={openManualBarcodeModal}
        onRequestClose={() => setOpenManualBarcodeModal(false)}
        title="Search Barcode">
        <ManualBarcodeForm
          onSubmit={(barcode) => {
            setScannedCode(barcode);
            _handleBarcodeScan(barcode, true);
            setOpenManualBarcodeModal(false);
          }}
        />
      </ModalFormMini>

      {extractingProduct && (
        <View className="flex h-full w-full flex-col items-center justify-center gap-10 p-10">
          <ActivityIndicator color="black" size="large" />
          <Text className="text-center">Extracting product data.</Text>
          <Text className="text-center">
            This might take a few minutes depending on your network speed
          </Text>
        </View>
      )}

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
          onBarcodeScanned={(res) => {
            debouncedHandleBarcodeScan(res.data);
          }}
        />
      )}

      <ScannerOverlay />

      <View className="absolute bottom-0 z-10 w-full rounded-t-3xl bg-black px-5 py-7">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-2xl font-bold color-white">Scan Barcode</Text>

          <TouchableOpacity onPress={() => router.back()} className="p-3">
            <AntDesign name="close" size={25} color="white" />
          </TouchableOpacity>
        </View>

        <View className="my-5">
          <Text className="text-lg color-white">
            Point your camera at the product barcode to search
          </Text>
        </View>
      </View>
    </View>
  );
}
