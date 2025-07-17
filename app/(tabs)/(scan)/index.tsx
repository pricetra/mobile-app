import { useLazyQuery } from '@apollo/client';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import ManualBarcodeForm from '@/components/ManualBarcodeForm';
import ScannerButton from '@/components/scanner/ScannerButton';
import Button from '@/components/ui/Button';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { barcodeTypes } from '@/constants/barcodeTypes';
import { BarcodeScanDocument } from '@/graphql/types/graphql';

export default function ScanScreen() {
  const [renderCameraComponent, setRenderCameraComponent] = useState(false);
  const [, setCamera] = useState<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string>();
  const [barcodeScan, { loading: barcodeScanLoading }] = useLazyQuery(BarcodeScanDocument);
  const [openManualBarcodeModal, setOpenManualBarcodeModal] = useState(false);
  const router = useRouter();

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

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function handleBarcodeScan(barcode: string, searchMode?: boolean) {
    barcodeScan({
      variables: { barcode, searchMode },
    }).then(({ error, data }) => {
      if (error || !data) {
        setRenderCameraComponent(false);
        return router.replace(`/(tabs)/(scan)/create-product?upc=${barcode.replaceAll('*', '')}`);
      }
      router.push(`/(tabs)/(products)/${data.barcodeScan.id}`);
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
            handleBarcodeScan(barcode, true);
            setOpenManualBarcodeModal(false);
          }}
        />
      </ModalFormMini>

      {renderCameraComponent && (
        <CameraView
          ratio="1:1"
          style={{
            flex: 1,
          }}
          facing={facing}
          autofocus="off"
          ref={(ref) => setCamera(ref)}
          barcodeScannerSettings={{
            barcodeTypes,
          }}
          onMountError={(e) => Alert.alert('Camera mount error', e.message)}
          onBarcodeScanned={(res) => {
            if (res.data === scannedCode) return;
            setScannedCode(res.data);
            handleBarcodeScan(res.data);
          }}>
          <View className="bottom-safe-or-5 absolute w-full gap-5 p-3">
            <View className="flex flex-row items-center justify-between">
              <ScannerButton onPress={() => router.back()}>
                <MaterialIcons name="arrow-back" size={25} color="white" />
              </ScannerButton>

              <ScannerButton
                onPress={() => {
                  if (!scannedCode) return;
                  handleBarcodeScan(scannedCode);
                }}
                onLongPress={() => setOpenManualBarcodeModal(true)}>
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
