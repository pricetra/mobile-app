import { ApolloError, useMutation } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';

import {
  AllProductsDocument,
  BarcodeScanDocument,
  CreateProduct,
  CreateProductDocument,
  UpdateProductDocument,
} from '../graphql/types/graphql';

import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Product } from '@/graphql/types/graphql';
import { createCloudinaryUrl, uploadToCloudinary } from '@/lib/files';

export type ProductFormProps = {
  product?: Product;
  onCancel: () => void;
  onSuccess: (product: Product) => void;
  onError: (e: ApolloError) => void;
};

export default function ProductForm({ product, onCancel, onSuccess, onError }: ProductFormProps) {
  const [imageUri, setImageUri] = useState<string>();
  const [imageUpdated, setImageUpdated] = useState(false);
  const [updateProduct, { loading: updateLoading }] = useMutation(UpdateProductDocument, {
    refetchQueries: [BarcodeScanDocument, AllProductsDocument],
  });
  const [createProduct, { loading: createLoading }] = useMutation(CreateProductDocument, {
    refetchQueries: [AllProductsDocument],
  });

  useEffect(() => {
    if (!product) return;
    setImageUri(product.image !== '' ? product.image : createCloudinaryUrl(product.code));
  }, [product]);

  async function selectImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
      base64: true,
      allowsMultipleSelection: false,
    });

    if (result.canceled || result.assets.length === 0) return;

    const picture = result.assets.at(0);
    if (!picture || !picture.uri) return alert('could not process image');

    setImageUpdated(true);
    setImageUri(picture.uri);
  }

  return (
    <Formik
      initialValues={
        {
          name: product?.name ?? '',
          description: product?.description ?? '',
          brand: product?.brand ?? '',
          code: product?.code ?? '',
          color: product?.color,
          // model: product?.model,
          category: product?.category,
          weight: product?.weight,
        } as CreateProduct
      }
      onSubmit={(values) => {
        if (product) {
          updateProduct({
            variables: {
              id: product.id,
              input: values,
            },
          })
            .then(({ data, errors }) => {
              console.log(data, errors);

              if (errors) return onError(errors.at(0) as ApolloError);
              if (!data) return;

              if (imageUri && imageUpdated) {
                uploadToCloudinary({
                  file: imageUri,
                  public_id: data.updateProduct.code,
                  tags: ['PRODUCT'],
                  onSuccess: () => onSuccess(data.updateProduct),
                  onError: (e) => onError(e as unknown as ApolloError),
                });
              } else {
                onSuccess(data.updateProduct);
              }
            })
            .catch((e) => onError(e));
        }
      }}>
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View className="flex flex-col gap-5">
          <TouchableOpacity onPress={selectImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="size-[93px] rounded-lg" />
            ) : (
              <View className="flex size-[93px] items-center justify-center rounded-md bg-gray-400">
                <Feather name="camera" color="white" size={35} />
              </View>
            )}
          </TouchableOpacity>

          <Input
            onChangeText={handleChange('code')}
            onBlur={handleBlur('code')}
            value={values.code}
            label="UPC Code"
            keyboardType="numeric"
          />

          <Textarea
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            label="Product Name"
          />

          <Input
            onChangeText={handleChange('brand')}
            onBlur={handleBlur('brand')}
            value={values.brand}
            label="Brand"
          />

          <Input
            onChangeText={handleChange('category')}
            onBlur={handleBlur('category')}
            value={values.category ?? ''}
            label="Category"
          />

          <View className="flex flex-row gap-2">
            <Input
              onChangeText={handleChange('color')}
              onBlur={handleBlur('color')}
              value={values.color ?? ''}
              label="Color"
              className="flex-1"
            />

            <Input
              onChangeText={handleChange('weight')}
              onBlur={handleBlur('weight')}
              value={values.weight ?? ''}
              label="Weight"
            />
          </View>

          <Textarea
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            value={values.description}
            label="Description"
          />

          {/* <Input
            onChangeText={handleChange('model')}
            onBlur={handleBlur('model')}
            value={values.model ?? ''}
            label="Model"
          /> */}

          <View className="mt-10 flex flex-row justify-between gap-3">
            <Button
              onPress={onCancel}
              className="flex-1 border-[1px] border-gray-500 bg-transparent"
              textClassName="color-gray-900"
              disabled={updateLoading || createLoading}>
              Cancel
            </Button>
            <Button
              onPress={handleSubmit}
              className="flex-1"
              loading={updateLoading || createLoading}>
              Update
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );
}
