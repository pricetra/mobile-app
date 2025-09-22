import { useLazyQuery } from '@apollo/client';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, AlertButton, Text, View } from 'react-native';

import ManualBarcodeForm from '@/components/ManualBarcodeForm';
import ProductForm, {
  selectImageForProductExtraction,
} from '@/components/product-form/ProductForm';
import ScannerButton from '@/components/scanner/ScannerButton';
import Button from '@/components/ui/Button';
import ModalFormMini from '@/components/ui/ModalFormMini';
import { barcodeTypes } from '@/constants/barcodeTypes';
import { useAuth } from '@/context/UserContext';
import {
  BarcodeScanDocument,
  ExtractProductFieldsDocument,
  Product,
  UserRole,
} from '@/graphql/types/graphql';
import { isRoleAuthorized } from '@/lib/roles';
import ModalFormFull from '@/components/ui/ModalFormFull';

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
  const [extractedProductData, setExtractedProductData] = useState<Product>();

  const [barcodeScan, { loading: barcodeScanLoading }] = useLazyQuery(BarcodeScanDocument);
  const [extractProductFields, { loading: extractingProduct }] = useLazyQuery(
    ExtractProductFieldsDocument,
    {
      fetchPolicy: 'no-cache',
    }
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

  function handleBarcodeScan(barcode: string, searchMode?: boolean) {
    barcodeScan({
      variables: { barcode, searchMode },
    }).then(({ error, data }) => {
      if (error || !data) {
        setRenderCameraComponent(false);
        const alertButtons: AlertButton[] = [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              setRenderCameraComponent(true);
            },
          },
          {
            text: 'Take Picture',
            style: 'default',
            isPreferred: true,
            onPress: () => {
              selectImageForProductExtraction(true).then(async (pic) => {
                if (!pic) return;

                const { data, error } = await extractProductFields({
                  variables: { base64Image: pic.base64 },
                });
                if (!data || error) {
                  setOpenCreateProductModal(true);
                  return;
                }
                const { weight, ...extraction } = data.extractProductFields;
                const product = { ...extraction } as Product;
                if (weight) {
                  const parsedWeight = weight.split(' ');
                  product.weightValue = +(parsedWeight.shift() ?? 0);
                  product.weightType = parsedWeight.join(' ');
                }
                setExtractedProductData(product);
                setOpenCreateProductModal(true);
              });
            },
          },
        ];

        if (isRoleAuthorized(UserRole.Contributor, user.role)) {
          alertButtons.splice(1, 0, {
            text: 'Add Manually',
            style: 'default',
            onPress: () => setOpenCreateProductModal(true),
          });
        }

        Alert.alert(
          'The barcode you scanned does not exist in our database',
          'You can help us record and track prices for this product by taking a picture',
          alertButtons
        );
        return;
      }
      router.push(`/(tabs)/(products)/${data.barcodeScan.id}`, { relativeToDirectory: false });
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

      {extractingProduct && (
        <View className="flex h-full w-full flex-col items-center justify-center gap-10 p-10">
          <ActivityIndicator color="black" size="large" />
          <Text className="text-center">Extracting product data...</Text>
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
            upc={scannedCode}
            product={
              {
                code: scannedCode.replaceAll('*', ''),
                ...extractedProductData,
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
