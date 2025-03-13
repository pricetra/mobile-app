import { useLazyQuery } from '@apollo/client';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

import ProductItem from '@/components/ProductItem';
import BarcodeText from '@/components/ui/BarcodeText';
import Button from '@/components/ui/Button';
import ScannerButton from '@/components/ui/ScannerButton';
import { BarcodeScanDocument } from '@/graphql/types/graphql';

export default function ScanScreen() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [camera, setCamera] = useState<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string>();
  const router = useRouter();
  const [
    barcodeScan,
    { loading: barcodeScanLoading, data: barcodeScanData, error: barcodeScanError },
  ] = useLazyQuery(BarcodeScanDocument);

  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);

      return () => {
        setIsCameraActive(false);
      };
    }, [camera])
  );

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

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
    });
  }

  if (!isCameraActive) return <></>;

  return (
    <CameraView
      ratio="1:1"
      style={{
        flex: 1,
      }}
      facing={facing}
      autofocus="on"
      ref={(ref) => setCamera(ref)}
      barcodeScannerSettings={{
        barcodeTypes: [
          'upc_a',
          'upc_e',
          'codabar',
          'code128',
          'code39',
          'code93',
          'ean13',
          'ean8',
          'itf14',
        ],
      }}
      onMountError={(e) => console.error('Camera mount error:', e)}
      onBarcodeScanned={(res) => {
        if (res.data === scannedCode) return;
        setScannedCode(res.data);
      }}>
      <View className="top-safe-or-10 absolute flex w-full flex-row items-center justify-between p-3">
        <ScannerButton onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={25} color="white" />
        </ScannerButton>

        {scannedCode && (
          <View className="rounded-xl bg-black/70 px-7 py-5">
            <BarcodeText
              className="text-xl color-white"
              onPress={() => handleBarcodeScan(scannedCode)}>
              {scannedCode}
            </BarcodeText>
          </View>
        )}
      </View>

      <View className="bottom-safe-or-10 absolute w-full p-3">
        <View className="mb-10">
          {barcodeScanData && (
            <View className="w-full rounded-lg bg-white p-5 shadow-xl shadow-black/50">
              <ProductItem product={barcodeScanData.barcodeScan} />
            </View>
          )}

          {barcodeScanError && <Text className="color-red-400">{barcodeScanError.message}</Text>}
        </View>

        <View className="flex flex-row items-center justify-between">
          <ScannerButton onPress={() => {}}>
            <MaterialIcons name="image" size={25} color="white" />
          </ScannerButton>

          <ScannerButton onPress={() => handleBarcodeScan(scannedCode ?? '')}>
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
  );
}
