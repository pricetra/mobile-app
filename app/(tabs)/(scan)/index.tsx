import { useLazyQuery, useMutation } from '@apollo/client';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, AlertButton, Text, View } from 'react-native';

import ManualBarcodeForm from '@/components/ManualBarcodeForm';
import ProductForm, {
  selectImageForProductExtraction,
} from '@/components/product-form/ProductForm';
import ScannerButton from '@/components/scanner/ScannerButton';
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
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string>();
  const [openManualBarcodeModal, setOpenManualBarcodeModal] = useState(false);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);

  const [barcodeScan, { loading: barcodeScanLoading }] = useLazyQuery(BarcodeScanDocument);
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

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function toProductPage(productId: number) {
    router.push(`/(tabs)/(products)/${productId}`, { relativeToDirectory: false });
  }

  function _handleBarcodeScan(barcode: string, searchMode?: boolean) {
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
            debouncedHandleBarcodeScan(res.data);
          }}>
          <View className="bottom-safe-or-5 absolute w-full gap-5 p-3">
            <View className="flex flex-row items-center justify-between">
              <ScannerButton onPress={() => router.back()}>
                <MaterialIcons name="arrow-back" size={25} color="white" />
              </ScannerButton>

              <ScannerButton
                onPress={() => {
                  if (!scannedCode) return;
                  _handleBarcodeScan(scannedCode);
                }}
                onLongPress={() => setOpenManualBarcodeModal(true)}>
                {barcodeScanLoading ? (
                  <ActivityIndicator color="white" size="large" />
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
