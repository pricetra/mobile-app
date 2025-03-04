import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanScreen() {
  const [camera, setCamera] = useState<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

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

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
      allowsMultipleSelection: false,
    });

    console.log(result);
    if (result.canceled) return;
    console.log(result.assets[0]);
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function captureImage() {
    if (!camera) return;

    const picture = await camera.takePictureAsync({
      base64: true,
      quality: 1,
    });
    console.log(picture);
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        autofocus="on"
        ref={(ref) => setCamera(ref)}>
        <View className="bottom-safe-or-28 absolute w-full p-3">
          <View className="flex flex-row items-center justify-between rounded-2xl bg-black/75 p-5">
            <TouchableOpacity onPress={pickImage} className="flex flex-col items-center gap-1">
              <MaterialIcons name="image" size={25} color="white" />
              <Text className="text-sm text-white">Pictures</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={captureImage} className="flex flex-col items-center gap-1">
              <MaterialIcons name="photo-camera" size={40} color="white" />
              <Text className="text-sm text-white">Capture</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleCameraFacing}
              className="flex flex-col items-center gap-2">
              <MaterialIcons name="flip-camera-android" size={25} color="white" />
              <Text className="text-sm text-white">Flip camera</Text>
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
