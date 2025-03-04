import { useLazyQuery } from '@apollo/client';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Buffer } from 'buffer';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BarcodeScanDocument } from '@/graphql/types/graphql';

export default function ScanScreen() {
  const [camera, setCamera] = useState<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string>();
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
    barcodeScan({ variables: { barcode } });
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
        <View className="bottom-safe-or-24 absolute w-full p-3">
          {scannedCode && (
            <View className="mb-10 flex w-full flex-col items-center gap-2 bg-black/70 p-10">
              <Text
                style={{ fontFamily: 'monospace' }}
                className="text-3xl color-white"
                onPress={() => handleBarcodeScan(scannedCode)}>
                {scannedCode}
              </Text>

              {barcodeScanData && (
                <View className="flex flex-row gap-2">
                  {barcodeScanData.barcodeScan.image && (
                    <Image
                      style={{ width: 60, height: 70 }}
                      source={{
                        uri: barcodeScanData.barcodeScan.image,
                      }}
                    />
                  )}
                  <Text className="flex-1 text-sm color-white">
                    {barcodeScanData.barcodeScan.name}
                  </Text>
                </View>
              )}

              {barcodeScanError && (
                <Text className="color-red-400">{barcodeScanError.message}</Text>
              )}

              {barcodeScanLoading && (
                <AntDesign
                  name="loading1"
                  className="size-[30px] animate-spin text-center"
                  color="white"
                  size={30}
                />
              )}
            </View>
          )}

          <View className="flex flex-row items-center justify-between">
            <TouchableOpacity
              onPress={pickImage}
              className="flex flex-col items-center gap-1 rounded-[200px] bg-black/50 p-5">
              <MaterialIcons name="image" size={25} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleBarcodeScan(scannedCode ?? '')}
              className="flex flex-col items-center gap-1 rounded-[200px] bg-black/50 p-5">
              <MaterialIcons name="search" size={40} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleCameraFacing}
              className="flex flex-col items-center gap-2 rounded-[200px] bg-black/50 p-5">
              <MaterialIcons name="flip-camera-android" size={25} color="white" />
            </TouchableOpacity>
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
