import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { Formik, FormikErrors } from 'formik';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Platform, ActivityIndicator } from 'react-native';
import CurrencyInput from 'react-native-currency-input';

import { Checkbox } from '../ui/Checkbox';
import Input from '../ui/Input';

import Btn from '@/components/ui/Btn';
import Button from '@/components/ui/Button';
import Combobox from '@/components/ui/Combobox';
import Image from '@/components/ui/Image';
import Label from '@/components/ui/Label';
import {
  CreatePrice,
  CreatePriceDocument,
  FavoriteBranchesWithPricesDocument,
  FindBranchesByDistanceDocument,
  GetProductStocksDocument,
  Price,
  Product,
} from '@/graphql/types/graphql';
import useLocationService from '@/hooks/useLocationService';
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
    refetchQueries: [GetProductStocksDocument, FavoriteBranchesWithPricesDocument],
  });
  const [branchId, setBranchId] = useState<string>();
  const { location, getCurrentLocation } = useLocationService();
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!location) {
      getCurrentLocation({});
      return;
    }
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
    setBranchId(branchesData.findBranchesByDistance.at(0)?.id?.toString());
  }, [branchesData]);

  if (branchesLoading)
    return (
      <View className="flex h-40 items-center justify-center p-10">
        <ActivityIndicator color="#374151" size="large" />
      </View>
    );

  if (!location) {
    return (
      <View className="flex h-40 items-center justify-center gap-5 py-10">
        <Text className="text-lg font-bold">Adding prices requires Location access</Text>
        <Button onPress={() => getCurrentLocation({})}>Request Location</Button>
      </View>
    );
  }

  if (!branchesData || branchesData.findBranchesByDistance.length === 0) {
    return (
      <View className="flex h-40 items-center justify-center gap-5 py-10">
        <Text className="text-lg font-bold">No branches found near you</Text>
        <Button onPress={() => getCurrentLocation({})}>Retry</Button>
      </View>
    );
  }

  return (
    <View className="mb-10 flex gap-10">
      <Combobox
        initialValue={branchId}
        dataSet={branchesData.findBranchesByDistance.map((b) => ({
          id: b.id.toString(),
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
          value: branchesData.findBranchesByDistance?.find(({ id }) => id.toString() === branchId)
            ?.name,
        }}
        renderItem={(item: any) => (
          <View className="flex flex-row items-center gap-2 p-3">
            <Image
              src={createCloudinaryUrl(item.logo ?? '', 100, 100)}
              className="size-[35px] rounded-lg"
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
          validateOnBlur
          validate={(values) => {
            const errors = {} as FormikErrors<CreatePrice>;
            if (values.amount <= 0) {
              errors.amount = 'Amount has to be higher than $0.00';
            }

            if (values.originalPrice && values.originalPrice <= values.amount) {
              errors.originalPrice = 'Original price cannot be smaller than the Sale price';
            }
            return errors;
          }}
          initialValues={
            {
              productId: product.id,
              branchId: +branchId,
              amount: 0.0,
              sale: false,
              unitType: 'item',
              expiresAt: dayjs(new Date()).add(7, 'day').toDate(),
            } as CreatePrice
          }
          onSubmit={(input, formik) => {
            createPrice({
              variables: {
                input: {
                  ...input,
                  branchId: +branchId,
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
                      fontWeight: '900',
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
                <View>
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
                      renderTextInput={(props) => (
                        <Input {...props} label="Original Price" placeholder="Amount" />
                      )}
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

                  <View className="mt-5">
                    <Label className="mb-5">Sale Expiration</Label>

                    <Button
                      onPress={() => {
                        setShowDatePicker(!showDatePicker);
                      }}>
                      {formik.values.expiresAt
                        ? dayjs(formik.values.expiresAt).format('MMM D, YYYY')
                        : 'Select Expiration Date'}
                    </Button>

                    {showDatePicker && (
                      <DateTimePicker
                        mode="date"
                        value={formik.values.expiresAt ?? new Date()}
                        display="spinner"
                        onChange={({ nativeEvent: e }) => {
                          formik.setFieldValue('expiresAt', new Date(e.timestamp));
                          if (Platform.OS === 'android') setShowDatePicker(false);
                        }}
                        minimumDate={new Date()}
                        accentColor="black"
                        textColor="black"
                        maximumDate={dayjs(new Date()).add(1, 'year').toDate()}
                      />
                    )}
                  </View>
                </View>
              )}

              <View className="mt-10">
                {formik.errors && (
                  <>
                    {Object.values(formik.errors).map((v, i) => (
                      <Text className="color-red-700" key={i}>
                        {v.toString()}
                      </Text>
                    ))}
                  </>
                )}

                <View className="mt-3 flex flex-row items-center gap-3">
                  <Btn
                    onPress={onCancel}
                    disabled={loading}
                    text="Cancel"
                    size="md"
                    bgColor="bg-gray-100"
                    color="text-gray-700"
                  />

                  <View className="flex-1">
                    <Btn
                      onPress={formik.submitForm}
                      loading={loading}
                      disabled={!formik.isValid || formik.values.amount === 0}
                      text="Submit Price"
                      size="md"
                    />
                  </View>
                </View>
              </View>

              {Platform.OS === 'ios' && formik.values.sale && <View style={{ height: 150 }} />}
            </View>
          )}
        </Formik>
      )}
    </View>
  );
}
