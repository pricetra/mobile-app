import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image as NativeImage } from 'react-native';

import BrandSelector from './BrandSelector';
import WeightSelector from './WeightSelector';

import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { Input } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Text from '@/components/ui/Text';
import { Textarea } from '@/components/ui/Textarea';
import {
  AllBrandsDocument,
  AllProductsDocument,
  BarcodeScanDocument,
  Brand,
  CreateProduct,
  CreateProductDocument,
  UpdateProductDocument,
  Product,
} from '@/graphql/types/graphql';
import { uploadToCloudinary } from '@/lib/files';
import { titleCase } from '@/lib/strings';

export type ProductFormProps = {
  upc?: string;
  product?: Product;
  onCancel: () => void;
  onSuccess: (product: Product) => void;
  onError: (e: ApolloError) => void;
};

export default function ProductForm({
  upc,
  product,
  onCancel,
  onSuccess,
  onError,
}: ProductFormProps) {
  const [imageUri, setImageUri] = useState<string>();
  const [imageUpdated, setImageUpdated] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>();
  const { data: brandsData, loading: brandsLoading } = useQuery(AllBrandsDocument);
  const [updateProduct, { loading: updateLoading }] = useMutation(UpdateProductDocument, {
    refetchQueries: [BarcodeScanDocument, AllProductsDocument, AllBrandsDocument],
  });
  const [createProduct, { loading: createLoading }] = useMutation(CreateProductDocument, {
    refetchQueries: [AllProductsDocument, AllBrandsDocument],
  });
  const loading = updateLoading || createLoading || imageUploading;

  useEffect(() => {
    if (product?.image && product.image !== '') {
      setImageUri(product.image);
    } else {
      setImageUri(undefined);
    }
  }, [product]);

  useEffect(() => {
    if (!brandsData) return;
    setBrands(brandsData.allBrands);
  }, [brandsData]);

  async function selectImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: false,
      allowsMultipleSelection: false,
      cameraType: ImagePicker.CameraType.back,
    });

    if (result.canceled || result.assets.length === 0) return;

    const picture = result.assets.at(0);
    if (!picture || !picture.uri) return alert('could not process image');

    setImageUpdated(true);
    setImageUri(picture.uri);
  }

  function submit(input: CreateProduct) {
    if (product) {
      updateProduct({
        variables: {
          id: product.id,
          input,
        },
      })
        .then(({ data, errors }) => {
          if (errors) return onError(errors.at(0) as ApolloError);
          if (!data) return;

          if (imageUri && imageUpdated) {
            setImageUploading(true);
            uploadToCloudinary({
              file: imageUri,
              public_id: data.updateProduct.code,
              tags: ['PRODUCT'],
              onSuccess: () => onSuccess(data.updateProduct),
              onError: (e) => onError(e as unknown as ApolloError),
              onFinally: () => setImageUploading(false),
            });
          } else {
            onSuccess(data.updateProduct);
          }
        })
        .catch((e) => onError(e));
    } else {
      createProduct({
        variables: {
          input,
        },
      })
        .then(({ data, errors }) => {
          if (errors) return onError(errors.at(0) as ApolloError);
          if (!data) return;

          if (imageUri && imageUpdated) {
            setImageUploading(true);
            uploadToCloudinary({
              file: imageUri,
              public_id: data.createProduct.code,
              tags: ['PRODUCT'],
              onSuccess: () => onSuccess(data.createProduct),
              onError: (e) => onError(e as unknown as ApolloError),
              onFinally: () => setImageUploading(false),
            });
          } else {
            onSuccess(data.createProduct);
          }
        })
        .catch((e) => onError(e));
    }
  }

  function renderImageSelection() {
    if (imageUpdated) {
      return <NativeImage src={imageUri} className="size-28 rounded-lg" />;
    }
    if (imageUri) {
      return <Image src={imageUri} className="size-28 rounded-lg" />;
    }
    return (
      <View className="flex size-28 items-center justify-center rounded-md bg-gray-400">
        <Feather name="camera" color="white" size={35} />
      </View>
    );
  }

  if (brandsLoading || !brands)
    return (
      <View className="flex h-40 items-center justify-center p-10">
        <AntDesign
          name="loading1"
          className="size-[50px] animate-spin text-center"
          color="#374151"
          size={50}
        />
      </View>
    );

  return (
    <Formik
      initialValues={
        {
          name: product?.name ?? '',
          description: product?.description ?? '',
          brand: product?.brand ?? '',
          code: product?.code ?? upc ?? '',
          color: product?.color,
          // model: product?.model,
          category: product?.category,
          weight: product?.weight,
        } as CreateProduct
      }
      onSubmit={submit}>
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
        <View className="flex flex-col gap-5">
          <TouchableOpacity onPress={!loading ? selectImage : () => {}}>
            {renderImageSelection()}
          </TouchableOpacity>
          {upc ? (
            <Input
              onChangeText={handleChange('code')}
              onBlur={handleBlur('code')}
              value={values.code}
              label="UPC Code"
              keyboardType="numeric"
              editable={!loading}
            />
          ) : (
            <Input value={values.code} label="UPC Code" editable={false} readOnly />
          )}
          <Textarea
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            label="Product Name"
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => {
              setFieldValue('name', titleCase(values.name));
            }}
            className="mb-5 mt-[-10px] inline-block w-fit">
            <Text className="inline-block w-fit text-right text-sm color-blue-500">
              Convert to Title Case
            </Text>
          </TouchableOpacity>

          <View style={{ position: 'relative' }}>
            <Label className="mb-1">Brand</Label>
            <BrandSelector
              editable={!loading}
              brandsLoading={brandsLoading}
              brands={brands}
              setBrands={setBrands}
              setValue={handleChange('brand')}
              value={values.brand}
            />
          </View>

          <Input
            onChangeText={handleChange('category')}
            onBlur={handleBlur('category')}
            value={values.category ?? ''}
            label="Category"
            editable={!loading}
          />
          <View className="flex flex-row justify-between gap-3">
            <Input
              onChangeText={handleChange('color')}
              onBlur={handleBlur('color')}
              value={values.color ?? ''}
              label="Color"
              editable={!loading}
              className="flex-1"
            />

            <WeightSelector
              onChangeText={handleChange('weight')}
              onBlur={handleBlur('weight')}
              value={values.weight ?? ''}
              editable={!loading}
            />
          </View>
          <Textarea
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            value={values.description}
            label="Description"
            editable={!loading}
          />
          {/* <Input
            onChangeText={handleChange('model')}
            onBlur={handleBlur('model')}
            value={values.model ?? ''}
            label="Model"
          /> */}
          <View className="my-10 flex flex-row justify-between gap-3">
            <Button onPress={onCancel} disabled={loading} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onPress={() => handleSubmit()}
              loading={loading}
              variant="secondary"
              className="flex-1">
              {product ? 'Update' : 'Create'}
            </Button>
          </View>

          <View className="h-[100px]" />
        </View>
      )}
    </Formik>
  );
}
