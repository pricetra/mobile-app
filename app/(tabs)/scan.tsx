import { useLazyQuery } from '@apollo/client';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions, CameraRatio } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';

import AddProductPriceForm from '@/components/product-form/AddProductPriceForm';
import ProductForm from '@/components/product-form/ProductForm';
import BarcodePreview from '@/components/scanner/BarcodePreview';
import ScannedProductView from '@/components/scanner/ScannedProductView';
import ScannerButton from '@/components/scanner/ScannerButton';
import Button from '@/components/ui/Button';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { barcodeTypes } from '@/constants/barcodeTypes';
import { BarcodeScanDocument, Product } from '@/graphql/types/graphql';

export default function ScanScreen() {
  const [renderCameraComponent, setRenderCameraComponent] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [ratio, setRatio] = useState<CameraRatio>('1:1');
  const [camera, setCamera] = useState<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string>();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [product, setProduct] = useState<Product>();
  const router = useRouter();
  const [
    barcodeScan,
    { loading: barcodeScanLoading, data: barcodeScanData, error: barcodeScanError },
  ] = useLazyQuery(BarcodeScanDocument);

  useFocusEffect(
    useCallback(() => {
      setRenderCameraComponent(true);

      return () => {
        setRenderCameraComponent(false);
      };
    }, [camera])
  );

  useEffect(() => {
    if (!barcodeScanData) return;
    setProduct(barcodeScanData.barcodeScan);
  }, [barcodeScanData]);

  useEffect(() => {
    if (!barcodeScanError) return;
    alert(barcodeScanError.message);
  }, [barcodeScanError]);

  useEffect(() => {
    if (openEditModal) {
      setCameraActive(false);
      return;
    }
    setCameraActive(true);
  }, [openEditModal]);

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

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function handleBarcodeScan(barcode: string) {
    barcodeScan({
      variables: { barcode },
    })
      .then(({ error }) => {
        if (!error) return;
        setOpenEditModal(true);
      })
      .catch((_err) => {
        setOpenEditModal(true);
      });
  }

  return (
    <View style={{ flex: 1 }}>
      {scannedCode && (
        <ModalFormMini
          title={product ? 'Edit Product' : 'Add Product'}
          visible={openEditModal}
          onRequestClose={() => setOpenEditModal(false)}>
          <ProductForm
            upc={scannedCode}
            product={product}
            onCancel={() => setOpenEditModal(false)}
            onSuccess={(p) => {
              setProduct(p);
              setOpenEditModal(false);
            }}
            onError={(e) => alert(e.message)}
          />
        </ModalFormMini>
      )}

      {scannedCode && product && (
        <ModalFormMini
          title="Add Product"
          visible={openPriceModal}
          onRequestClose={() => setOpenPriceModal(false)}>
          <AddProductPriceForm
            product={product}
            onCancel={() => setOpenPriceModal(false)}
            // onSuccess={(p) => {
            //   setOpenPriceModal(false);
            // }}
            // onError={(e) => alert(e.message)}
          />
        </ModalFormMini>
      )}

      {renderCameraComponent && (
        <CameraView
          active={cameraActive}
          ratio={ratio}
          style={{
            flex: 1,
          }}
          facing={facing}
          autofocus="off"
          ref={(ref) => setCamera(ref)}
          barcodeScannerSettings={{
            barcodeTypes,
          }}
          onMountError={(e) => console.error('Camera mount error:', e)}
          onBarcodeScanned={(res) => {
            if (Platform.OS === 'android') setRatio('16:9');

            if (res.data === scannedCode) return;
            setScannedCode(res.data);
            setProduct(undefined);
          }}>
          <View className="top-safe-or-10 absolute flex w-full flex-row items-center justify-end p-5">
            {scannedCode && <BarcodePreview scannedCode={scannedCode} />}
          </View>

          <View className="bottom-safe-or-5 absolute w-full gap-5 p-3">
            {product && (
              <ScannedProductView
                product={product}
                onEditModalPress={() => setOpenEditModal(true)}
                onAddPriceModalPress={() => setOpenPriceModal(true)}
              />
            )}

            <View className="flex flex-row items-center justify-between">
              <ScannerButton onPress={() => router.back()}>
                <MaterialIcons name="arrow-back" size={25} color="white" />
              </ScannerButton>

              <ScannerButton
                onPress={() => {
                  if (!scannedCode) return;
                  handleBarcodeScan(scannedCode);
                }}>
                {barcodeScanLoading ? (
                  <AntDesign
                    name="loading1"
                    className="size-[40px] animate-spin text-center"
                    color="white"
                    size={40}
                  />
                ) : (
                  <MaterialIcons name="search" size={40} color="white" />
                )}
              </ScannerButton>

              <ScannerButton onPress={toggleCameraFacing}>
                <MaterialIcons name="flip-camera-android" size={25} color="white" />
              </ScannerButton>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}
