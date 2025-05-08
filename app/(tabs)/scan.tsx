import { useLazyQuery } from '@apollo/client';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions, CameraRatio } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';

import ProductForm from '@/components/product-form/ProductForm';
import BarcodePreview from '@/components/scanner/BarcodePreview';
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
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [barcodeScan, { loading: barcodeScanLoading, error: barcodeScanError }] =
    useLazyQuery(BarcodeScanDocument);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setRenderCameraComponent(true);

      return () => {
        setRenderCameraComponent(false);
      };
    }, [camera])
  );

  useEffect(() => {
    if (!barcodeScanError) return;
    alert(barcodeScanError.message);
  }, [barcodeScanError]);

  useEffect(() => {
    if (openAddProductModal) {
      setCameraActive(false);
      return;
    }
    setCameraActive(true);
  }, [openAddProductModal]);

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

  async function handleBarcodeScan(barcode: string): Promise<Product | undefined> {
    const { error, data } = await barcodeScan({
      variables: { barcode },
    });
    if (error || !data) {
      setOpenAddProductModal(true);
      return undefined;
    }
    return data.barcodeScan;
  }

  return (
    <View style={{ flex: 1 }}>
      {scannedCode && (
        <ModalFormMini
          title="Add Product"
          visible={openAddProductModal}
          onRequestClose={() => setOpenAddProductModal(false)}>
          <ProductForm
            upc={scannedCode}
            onCancel={() => setOpenAddProductModal(false)}
            onSuccess={(p) => {
              router.navigate(`/(tabs)/(products)/${p.id}`);
              setOpenAddProductModal(false);
            }}
            onError={(e) => alert(e.message)}
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
          }}>
          <View className="top-safe-or-10 absolute flex w-full flex-row items-center justify-end p-5">
            {scannedCode && <BarcodePreview scannedCode={scannedCode} />}
          </View>

          <View className="bottom-safe-or-5 absolute w-full gap-5 p-3">
            <View className="flex flex-row items-center justify-between">
              <ScannerButton onPress={() => router.back()}>
                <MaterialIcons name="arrow-back" size={25} color="white" />
              </ScannerButton>

              <ScannerButton
                onPress={async () => {
                  if (!scannedCode) return;

                  try {
                    const p = await handleBarcodeScan(scannedCode);
                    if (!p) return;
                    console.log(`/(tabs)/(products)/${p.id}`);
                    router.push(`/(tabs)/(products)/${p.id}`);
                  } catch (err) {
                    alert(err);
                  }
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
