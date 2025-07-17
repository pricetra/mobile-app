import { useLazyQuery } from '@apollo/client';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Text, View, TouchableOpacity } from 'react-native';

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
  const [popover, setPopover] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setRenderCameraComponent(true);
      setPopover(true);

      setTimeout(() => {
        setPopover(false);
      }, 5_000);

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
          <View className="top-safe-or-5 absolute w-full p-3">
            <View className="flex flex-row items-center justify-between gap-5">
              <View className="rounded-xl bg-black/50 px-4 py-3 backdrop-blur-lg">
                <Text className="text-xl font-bold color-white">Extract Product Details</Text>
              </View>
            </View>
          </View>

          <View className="bottom-safe-or-5 absolute flex w-full flex-col items-center gap-5 p-3">
            {popover && (
              <TouchableOpacity
                onPress={() => setPopover(false)}
                className="rounded-xl bg-pricetraGreenDark px-3 py-2">
                <Text className="text-sm text-white">
                  Align product inside the view finder and press to capture image and extract
                  details
                </Text>
                <Fontisto
                  name="caret-down"
                  size={15}
                  color="#5fae23"
                  className="absolute -bottom-[10px] left-1/2"
                />
              </TouchableOpacity>
            )}

            <View className="flex w-full flex-row items-center justify-between gap-5">
              <ScannerButton onPress={() => router.back()}>
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
