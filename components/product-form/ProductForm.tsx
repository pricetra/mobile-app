import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';

import BrandSelector from './BrandSelector';
import CategorySelector from './CategorySelector';
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
  Category,
} from '@/graphql/types/graphql';
import { uploadToCloudinary } from '@/lib/files';
import { titleCase } from '@/lib/strings';
import { diffObjects } from '@/lib/utils';

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
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const loading = updateLoading || createLoading || imageUploading;

  useEffect(() => {
    if (!product) return;

    if (product.image && product.image !== '') {
      setImageUri(product.image);
    } else {
      setImageUri(undefined);
    }

    if (product.category) setSelectedCategory(product.category);
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
    if (!selectedCategory) return alert('Please select a valid category');

    input.categoryId = selectedCategory.id;
    if (product) {
      const filteredInput = diffObjects(input, product);
      updateProduct({
        variables: {
          id: product.id,
          input: filteredInput,
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
          weight: product?.weight,
        } as CreateProduct
      }
      onSubmit={submit}>
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
        <View className="flex flex-col gap-5">
          <View className="flex flex-row items-center justify-between gap-5">
            <TouchableOpacity onPress={!loading ? selectImage : () => {}}>
              {renderImageSelection()}
            </TouchableOpacity>

            <Text className="font-bold text-black">OR</Text>

            <TouchableOpacity
              onPress={() => {
                const query = values.brand !== '' ? `${values.brand} ${values.name}` : values.name;
                Linking.openURL(`https://www.google.com/search?udm=2&q=${encodeURI(query)}`);
              }}>
              <View className="flex size-28 items-center justify-center gap-2 rounded-md bg-sky-100/50">
                <Feather name="globe" color="#3b82f6" size={35} />
                <Text className="px-2 text-center text-xs text-blue-500">Search for Images</Text>
              </View>
            </TouchableOpacity>
          </View>
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

          <View className="relative">
            <Label className="mb-1">Category</Label>
            <CategorySelector
              category={product?.category ?? undefined}
              editable={!loading}
              onChange={setSelectedCategory}
            />
          </View>

          <WeightSelector
            onChangeText={handleChange('weight')}
            onBlur={handleBlur('weight')}
            value={values.weight ?? ''}
            editable={!loading}
          />

          <Textarea
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            value={values.description}
            label="Description"
            editable={!loading}
          />
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
