import { useLazyQuery } from '@apollo/client';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Buffer } from 'buffer';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import ProductItem from '@/components/ProductItem';
import BarcodeText from '@/components/ui/BarcodeText';
import ScannerButton from '@/components/ui/ScannerButton';
import { UserAuthContext } from '@/context/UserContext';
import { BarcodeScanDocument } from '@/graphql/types/graphql';

export default function ScanScreen() {
  const { token } = useContext(UserAuthContext);
  const [camera, setCamera] = useState<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string>();
  const router = useRouter();
  const [
    barcodeScan,
    { loading: barcodeScanLoading, data: barcodeScanData, error: barcodeScanError },
  ] = useLazyQuery(BarcodeScanDocument);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text className="pb-10 text-center">We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function analyzeBase64Image(pictureBase64: string) {
    const buffer = Buffer.from(pictureBase64, 'base64');
    // TODO: read barcode
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
      base64: true,
      allowsMultipleSelection: false,
    });

    if (result.canceled || result.assets.length === 0) throw new Error('could not pick image');

    const picture = result.assets[0];
    if (!picture.base64) throw new Error('could not process image');

    analyzeBase64Image(picture.base64);
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function handleBarcodeScan(barcode: string) {
    barcodeScan({
      variables: { barcode },
      context: { headers: { authorization: `Bearer ${token}` } },
    });
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
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
            <ScannerButton onPress={pickImage}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
});
