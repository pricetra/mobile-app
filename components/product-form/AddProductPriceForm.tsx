import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import CurrencyInput from 'react-native-currency-input';

import { Checkbox } from '../ui/Checkbox';
import Input from '../ui/Input';

import Button from '@/components/ui/Button';
import Combobox from '@/components/ui/Combobox';
import Image from '@/components/ui/Image';
import {
  CreatePrice,
  CreatePriceDocument,
  FindBranchesByDistanceDocument,
  GetProductStocksDocument,
  Price,
  Product,
} from '@/graphql/types/graphql';
import useCurrentLocation from '@/hooks/useCurrentLocation';
import { createCloudinaryUrl } from '@/lib/files';

export type AddProductPriceFormProps = {
  product: Product;
  onCancel: () => void;
  onSuccess: (p: Price) => void;
  onError: (e: ApolloError) => void;
};

export default function AddProductPriceForm({
  product,
  onCancel,
  onSuccess,
  onError,
}: AddProductPriceFormProps) {
  const [findBranchesByDistance, { data: branchesData, loading: branchesLoading }] = useLazyQuery(
    FindBranchesByDistanceDocument,
    { fetchPolicy: 'no-cache' }
  );
  const [createPrice, { loading }] = useMutation(CreatePriceDocument, {
    refetchQueries: [GetProductStocksDocument],
  });
  const [branchId, setBranchId] = useState<string>();
  const { location } = useCurrentLocation();

  useEffect(() => {
    if (!location) return;
    findBranchesByDistance({
      variables: {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        radiusMeters: 10000, // TODO: Ideally use 500 meters as the radius
      },
    });
  }, [location]);

  useEffect(() => {
    if (!branchesData) return;
    setBranchId(branchesData.findBranchesByDistance.at(0)?.id);
  }, [branchesData]);

  if (!location || branchesLoading || !branchesData)
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
    <View className="mb-10 flex gap-10">
      <Combobox
        initialValue={branchId}
        dataSet={branchesData.findBranchesByDistance.map((b) => ({
          id: b.id,
          title: b.name,
          description: b.address?.fullAddress,
          logo: b.store?.logo,
        }))}
        onSelectItem={(data) => {
          if (!data) return;
          setBranchId(data.id);
        }}
        textInputProps={{
          placeholder: 'Select Branch',
          value: branchesData.findBranchesByDistance?.find(({ id }) => id === branchId)?.name,
        }}
        renderItem={(item: any) => (
          <View className="flex flex-row items-center gap-2 p-3">
            <Image
              src={createCloudinaryUrl(item.logo ?? '', 100, 100)}
              className="size-[35px] rounded-full"
            />
            <View>
              <Text className="text font-semibold">{item.title}</Text>
              <Text className="text-xs">{item.description}</Text>
            </View>
          </View>
        )}
      />

      {branchId && (
        <Formik
          initialValues={
            {
              productId: product.id,
              branchId,
              amount: 0.0,
              sale: false,
              unitType: 'item',
            } as CreatePrice
          }
          onSubmit={(input, formik) => {
            createPrice({
              variables: {
                input: {
                  ...input,
                  branchId,
                },
              },
            })
              .then(({ data }) => {
                if (!data) return;
                onSuccess(data.createPrice as Price);
              })
              .catch((e) => onError(e));
          }}>
          {(formik) => (
            <View className="flex flex-col gap-5">
              <CurrencyInput
                value={formik.values.amount}
                onChangeValue={(v) => {
                  formik.setFieldValue('amount', v ?? 0);
                }}
                onBlur={formik.handleBlur('amount')}
                prefix="$"
                delimiter=","
                separator="."
                precision={2}
                minValue={0}
                maxValue={1000}
                renderTextInput={(props) => (
                  <TextInput
                    {...props}
                    style={{
                      fontSize: 50,
                      textAlign: 'center',
                      letterSpacing: 5,
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                    }}
                  />
                )}
              />

              <Checkbox
                label="Sale"
                checked={formik.values.sale}
                onCheckedChange={(c) => formik.setFieldValue('sale', c)}
              />

              {formik.values.sale && (
                <View className="flex flex-row items-center justify-stretch gap-4">
                  <CurrencyInput
                    value={formik.values.originalPrice ?? null}
                    onChangeValue={(v) => {
                      formik.setFieldValue('originalPrice', v ?? 0);
                    }}
                    onBlur={formik.handleBlur('originalPrice')}
                    prefix="$"
                    delimiter=","
                    separator="."
                    precision={2}
                    minValue={0}
                    maxValue={1000}
                    renderTextInput={(props) => <Input {...props} label="Original Price" />}
                  />

                  <Input
                    label="Condition"
                    value={formik.values.condition ?? undefined}
                    onChangeText={formik.handleChange('condition')}
                    onBlur={formik.handleBlur('condition')}
                    className="flex-1"
                    placeholder="Ex. Multiples of 2"
                  />
                </View>
              )}

              <Button
                className="mt-10"
                variant="secondary"
                loading={loading}
                onPress={formik.submitForm}
                disabled={formik.values.amount <= 0}>
                Submit Price
              </Button>
            </View>
          )}
        </Formik>
      )}
    </View>
  );
}
