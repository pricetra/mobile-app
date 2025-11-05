import { ApolloError, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { AntDesign, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, TouchableOpacity, View } from 'react-native';

import BrandSelector from './BrandSelector';
import CategorySelector from './CategorySelector';
import WeightSelector from './WeightSelector';

import Btn from '@/components/ui/Btn';
import { Checkbox } from '@/components/ui/Checkbox';
import Image from '@/components/ui/Image';
import { Input } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Text from '@/components/ui/Text';
import { Textarea } from '@/components/ui/Textarea';
import {
  AllBrandsDocument,
  AllProductsDocument,
  Brand,
  CreateProduct,
  CreateProductDocument,
  UpdateProductDocument,
  Product,
  Category,
  ProductDocument,
  ExtractProductFieldsDocument,
} from '@/graphql/types/graphql';
import { buildBase64ImageString, titleCase } from '@/lib/strings';
import { diffObjects } from '@/lib/utils';

export type ProductFormProps = {
  upc?: string;
  product?: Product;
  onCancel: (formik: FormikHelpers<CreateProduct>) => void;
  onSuccess: (product: Product, formik: FormikHelpers<CreateProduct>) => void;
  onError: (e: ApolloError, formik: FormikHelpers<CreateProduct>) => void;
};

export default function ProductForm({
  upc,
  product,
  onCancel,
  onSuccess,
  onError,
}: ProductFormProps) {
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [imageUri, setImageUri] = useState<string>();
  const [imageBase64, setImageBase64] = useState<string>();
  const [imageUpdated, setImageUpdated] = useState(false);
  const [brands, setBrands] = useState<Brand[]>();
  const { data: brandsData, loading: brandsLoading } = useQuery(AllBrandsDocument, {
    fetchPolicy: 'network-only',
  });
  const [updateProduct, { loading: updateLoading }] = useMutation(UpdateProductDocument, {
    refetchQueries: [AllProductsDocument, AllBrandsDocument, ProductDocument],
  });
  const [createProduct, { loading: createLoading }] = useMutation(CreateProductDocument, {
    refetchQueries: [AllProductsDocument, AllBrandsDocument],
  });
  const [extractProductFields] = useLazyQuery(ExtractProductFieldsDocument, {
    fetchPolicy: 'no-cache',
  });
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const loading = updateLoading || createLoading;
  const [isPLU, setIsPLU] = useState(false);
  const isUpdateProduct = product !== undefined && product.id !== undefined && product.id !== 0;

  // Check for PLU codes (Produce)
  useEffect(() => {
    if (!upc || product) return;
    if (upc.length < 4 || upc.length > 5) return;

    const myCategory: Category = {
      id: 509,
      name: 'Produce',
      path: '{462,509}',
      expandedPathname: 'Food, Beverages & Tobacco > Produce',
      depth: 2,
    };
    setSelectedCategory(myCategory);
    setIsPLU(true);
  }, [upc, product]);

  useEffect(() => {
    if (!product) return;

    if (product.category) {
      setSelectedCategory(product.category);
    }

    if (product.image && product.image !== '') {
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
    const picture = await selectImageForProductExtraction();
    if (!picture) return;

    setImageUpdated(true);
    setImageUri(picture.imageUri);
    setImageBase64(picture.base64);
  }

  function resetImageAndCategory() {
    setImageUri(undefined);
    setImageBase64(undefined);
    setImageUpdated(false);
    setSelectedCategory(undefined);
  }

  function submit(input: CreateProduct, formik: FormikHelpers<CreateProduct>) {
    if (!selectedCategory) return alert('Please select a valid category');

    const imageAdded = imageUri && imageBase64 && imageUpdated;
    input.categoryId = selectedCategory.id;

    if (input.weight === '') input.weight = undefined;
    if (!input.description) input.description = '';

    if (imageAdded) input.imageBase64 = imageBase64;

    if (isUpdateProduct) {
      const filteredInput = diffObjects(input, product);
      if (Object.keys(filteredInput).length === 0 && !imageAdded) return;

      updateProduct({
        variables: {
          id: product.id,
          input: filteredInput,
        },
      })
        .then(({ data, errors }) => {
          if (errors) return onError(errors.at(0) as ApolloError, formik);
          if (!data) return;

          resetImageAndCategory();
          onSuccess(data.updateProduct as Product, formik);
        })
        .catch((e) => onError(e, formik));
      return;
    }

    createProduct({
      variables: {
        input,
      },
    })
      .then(({ data, errors }) => {
        if (errors) return onError(errors.at(0) as ApolloError, formik);
        if (!data) return;

        resetImageAndCategory();
        onSuccess(data.createProduct as Product, formik);
      })
      .catch((e) => onError(e, formik));
  }

  function renderImageSelection() {
    if (imageUri) {
      return <Image src={imageUri} className="size-28 rounded-xl" />;
    }
    return (
      <View className="flex size-28 items-center justify-center rounded-xl bg-gray-400">
        <Feather name="camera" color="white" size={35} />
      </View>
    );
  }

  async function onPressAutofill(formik: FormikProps<CreateProduct>) {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 2],
      quality: 0,
      base64: true,
      allowsMultipleSelection: false,
      cameraType: ImagePicker.CameraType.back,
    });
    if (result.canceled || result.assets.length === 0) return;

    const picture = result.assets.at(0);
    if (!picture || !picture.base64) return;

    setAnalyzingImage(true);
    const manipulationResult = await ImageManipulator.manipulateAsync(
      picture.uri,
      [{ resize: { width: 1000 } }],
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );
    const base64Image = manipulationResult.base64;
    const encodedBase64 = `data:image/jpeg;base64,${base64Image}`;
    const { data, error } = await extractProductFields({
      variables: {
        base64Image: encodedBase64,
      },
    }).finally(() => setAnalyzingImage(false));
    if (error || !data) {
      Alert.alert(
        'Could not auto-fill using the provided image',
        error?.message ?? 'No data found'
      );
      return;
    }

    const extractedFields = data.extractProductFields;
    formik.setFieldValue('brand', extractedFields.brand);
    formik.setFieldValue('name', extractedFields.name);
    formik.setFieldValue('description', extractedFields.description);
    if (extractedFields.weight) {
      formik.setFieldValue('weight', extractedFields.weight);
    }
    if (extractedFields.quantity) {
      formik.setFieldValue('quantityValue', extractedFields.quantity);
    }
    if (extractedFields.netWeight) {
      formik.setFieldValue('netWeight', extractedFields.netWeight);
    }
    if (extractedFields.categoryId && extractedFields.category) {
      setSelectedCategory({ ...extractedFields.category });
    }
  }

  if (brandsLoading || !brands)
    return (
      <View className="flex h-40 items-center justify-center p-10">
        <ActivityIndicator color="#374151" size="large" />
      </View>
    );

  return (
    <Formik
      enableReinitialize
      initialValues={
        {
          ...product,
          code: product?.code ?? upc ?? '',
          weight:
            product?.weightValue && product?.weightType
              ? `${product.weightValue} ${product.weightType}`
              : undefined,
          quantityValue: product?.quantityValue ?? '1',
        } as CreateProduct
      }
      onSubmit={submit}>
      {(formik) => (
        <View className="flex flex-col gap-5">
          <Input value={formik.values.code} label="UPC Code" editable={false} readOnly />

          <View style={{ position: 'relative' }}>
            <Label className="mb-1">Brand</Label>
            <BrandSelector
              editable={!loading}
              brandsLoading={brandsLoading}
              brands={brands}
              setBrands={setBrands}
              setValue={formik.handleChange('brand')}
              value={isPLU ? 'N/A' : formik.values.brand}
            />
          </View>

          <View className="mb-10">
            <Textarea
              onChangeText={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              value={formik.values.name}
              label="Product Name"
              editable={!loading}
              placeholder="Ex: Great Value Grade A Whole Milk (1 Gallon)"
              autoCapitalize="words"
            />

            <View className="mt-3 flex flex-row gap-3">
              <TouchableOpacity
                disabled={analyzingImage}
                onPress={() => onPressAutofill(formik)}
                className="flex flex-row items-center gap-3 rounded-xl border-[1px] border-emerald-300 bg-emerald-50 px-5 py-3">
                {analyzingImage ? (
                  <AntDesign
                    name="loading1"
                    className="size-[20px] animate-spin"
                    color="#059669"
                    size={20}
                  />
                ) : (
                  <MaterialIcons name="camera-enhance" size={20} color="#059669" />
                )}
                <Text className="text-sm color-emerald-600">Autofill with Image</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  formik.setFieldValue('name', titleCase(formik.values.name));
                }}
                className="flex flex-row items-center gap-3 rounded-xl border-[1px] border-purple-300 bg-purple-50 px-5 py-3">
                <MaterialCommunityIcons name="format-text" size={20} color="#9333ea" />
                <Text className="text-sm color-purple-600">Title Case</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-10">
            <Label className="mb-5">Product Image</Label>

            <View className="flex flex-row items-center justify-between gap-5">
              <TouchableOpacity onPress={!loading ? selectImage : () => {}}>
                {renderImageSelection()}
              </TouchableOpacity>

              <Text className="font-bold text-black">OR</Text>

              <TouchableOpacity
                onPress={() => {
                  const brand = formik.values.brand.toLocaleLowerCase();
                  const productName = formik.values.name;
                  const query: string[] = [];
                  if (brand !== 'n/a' && !productName.toLowerCase().includes(brand)) {
                    query.push(formik.values.brand);
                  }
                  query.push(formik.values.name);
                  Linking.openURL(
                    `https://www.google.com/search?udm=2&q=${encodeURIComponent(query.join(' '))}`
                  );
                }}
                className="flex size-28 items-center justify-center gap-2 rounded-xl bg-sky-100/50">
                <Feather name="globe" color="#3b82f6" size={35} />
                <Text className="px-2 text-center text-xs text-blue-500">Search for Images</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="relative">
            <Label className="mb-1">Category</Label>
            <CategorySelector
              category={selectedCategory}
              editable={!loading}
              onChange={setSelectedCategory}
            />
          </View>

          <View className="flex flex-row items-center justify-center gap-2">
            <View className="flex-1">
              <Input
                onChangeText={formik.handleChange('quantityValue')}
                onBlur={formik.handleBlur('quantityValue')}
                value={formik.values.quantityValue?.toString() ?? '1'}
                label="Quantity"
                keyboardType="number-pad"
              />
            </View>

            <View>
              <Input
                onChangeText={formik.handleChange('quantityType')}
                onBlur={formik.handleBlur('quantityType')}
                value={formik.values.quantityType?.toString() ?? 'count'}
                label="Unit"
                keyboardType="ascii-capable"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="mb-3 flex flex-col gap-2">
            <View className="flex flex-1 flex-row items-center justify-center gap-3 ">
              <WeightSelector
                onChangeText={(v) => {
                  if (!v.weightType || !v.weightValue) {
                    formik.setFieldValue('weight', '');
                    return;
                  }
                  formik.setFieldValue('weight', `${v.weightValue} ${v.weightType}`);
                }}
                onBlur={formik.handleBlur('weight')}
                value={formik.values.weight ?? undefined}
                editable={!loading}
              />
            </View>

            <View className="flex flex-row flex-wrap items-center gap-5">
              <Checkbox
                label="Net weight"
                checked={formik.values.netWeight ?? false}
                onCheckedChange={(c) => formik.setFieldValue('netWeight', c)}
                bold={false}
              />

              <Checkbox
                label="Approximate weight"
                checked={formik.values.approximateWeight ?? false}
                onCheckedChange={(c) => formik.setFieldValue('approximateWeight', c)}
                bold={false}
              />
            </View>
          </View>

          <Textarea
            onChangeText={formik.handleChange('description')}
            onBlur={formik.handleBlur('description')}
            value={formik.values.description}
            label="Description"
            editable={!loading}
          />
          <View className="my-10 flex flex-row items-center gap-3">
            <Btn
              onPress={() => {
                formik.resetForm();
                onCancel(formik);
              }}
              disabled={loading}
              text="Cancel"
              size="md"
              bgColor="bg-gray-100"
              color="text-gray-700"
            />

            <View className="flex-1">
              <Btn
                onPress={() => formik.handleSubmit()}
                loading={loading}
                text={isUpdateProduct ? 'Update' : 'Create'}
                size="md"
              />
            </View>
          </View>

          <View className="h-[100px]" />
        </View>
      )}
    </Formik>
  );
}

export type ExtractionImageSelectionType = {
  imageUri: string;
  base64: string;
  base64EncodingOnly?: string;
};

export async function selectImageForProductExtraction(
  useCamera: boolean = false,
  quality: number = 1
): Promise<ExtractionImageSelectionType | undefined> {
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality,
    base64: true,
    allowsMultipleSelection: false,
    cameraType: ImagePicker.CameraType.back,
  };
  const result = await (useCamera
    ? ImagePicker.launchCameraAsync(options)
    : ImagePicker.launchImageLibraryAsync(options));

  if (result.canceled || result.assets.length === 0) return undefined;

  const picture = result.assets.at(0);
  if (!picture || !picture.base64 || !picture.uri) return undefined;

  return {
    imageUri: picture.uri,
    base64: buildBase64ImageString(picture),
    base64EncodingOnly: picture.base64,
  };
}
