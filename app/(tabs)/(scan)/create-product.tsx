import { useLazyQuery } from '@apollo/client';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import ProductForm from '@/components/product-form/ProductForm';
import ScannerButton from '@/components/scanner/ScannerButton';
import Button from '@/components/ui/Button';
import ModalFormFull from '@/components/ui/ModalFormFull';
import { ExtractProductFieldsDocument, Product } from '@/graphql/types/graphql';

export default function CreateProductScreen() {
  const [renderCameraComponent, setRenderCameraComponent] = useState(false);
  const [camera, setCamera] = useState<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const router = useRouter();
  const [extractProductFields, { loading, data: extractionData }] = useLazyQuery(
    ExtractProductFieldsDocument
  );
  const { upc } = useLocalSearchParams<{ upc?: string }>();

  useFocusEffect(
    useCallback(() => {
      setRenderCameraComponent(true);

      return () => {
        setRenderCameraComponent(false);
      };
    }, [upc])
  );

  useEffect(() => {
    if (upc) return;
    router.back();
  }, [upc]);

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

  return (
    <View style={{ flex: 1 }}>
      {upc && extractionData && (
        <ModalFormFull
          visible={openCreateProductModal}
          onRequestClose={() => {
            setOpenCreateProductModal(false);
            setRenderCameraComponent(true);
          }}
          title="Create Product">
          <ProductForm
            upc={upc}
            product={
              {
                code: upc,
                ...extractionData.extractProductFields,
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
          onMountError={(e) => Alert.alert('Camera mount error', e.message)}>
          <View className="bottom-safe-or-5 absolute w-full gap-5 p-3">
            <View className="flex flex-row items-center justify-between">
              <ScannerButton onPress={() => router.replace('/(tabs)/(scan)')}>
                <MaterialIcons name="arrow-back" size={25} color="white" />
              </ScannerButton>

              <ScannerButton
                onPress={() => {
                  camera
                    ?.takePictureAsync({
                      base64: true,
                      imageType: 'jpg',
                      quality: 0,
                    })
                    .then(async (data) => {
                      if (!data?.base64) return;
                      const base64Image = `data:image/jpeg;base64,${data.base64}`;
                      const { data: extractionData, error } = await extractProductFields({
                        variables: { base64Image },
                      });
                      if (error || !extractionData) {
                        Alert.alert(
                          'Could not auto-fill using the provided image',
                          error?.message ?? 'No data found'
                        );
                        return;
                      }
                      setOpenCreateProductModal(true);
                    });
                }}>
                {loading ? (
                  <AntDesign
                    name="loading1"
                    className="size-[40px] animate-spin text-center"
                    color="white"
                    size={40}
                  />
                ) : (
                  <MaterialCommunityIcons name="cube-scan" size={40} color="white" />
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
