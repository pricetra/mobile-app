import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { Formik, FormikErrors, FormikProps, useFormikContext } from 'formik';
import {
  BranchesWithProductsDocument,
  CreatePrice,
  CreatePriceDocument,
  FavoriteBranchesWithPricesDocument,
  FindBranchesByDistanceDocument,
  GetProductStocksDocument,
  GetStockFromProductAndBranchIdDocument,
  Price,
  Product,
  Stock,
  StockDocument,
  UserRole,
} from 'graphql-utils';
import { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Platform, ActivityIndicator } from 'react-native';
import CurrencyInput from 'react-native-currency-input';

import ProductItem from '../ProductItem';
import { Checkbox } from '../ui/Checkbox';
import Input from '../ui/Input';

import Btn from '@/components/ui/Btn';
import Button from '@/components/ui/Button';
import Combobox from '@/components/ui/Combobox';
import Image from '@/components/ui/Image';
import Label from '@/components/ui/Label';
import { useAuth } from '@/context/UserContext';
import useLocationService from '@/hooks/useLocationService';
import { createCloudinaryUrl } from '@/lib/files';
import { isRoleAuthorized } from '@/lib/roles';

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
  const { user } = useAuth();
  const [findBranchesByDistance, { data: branchesData, loading: branchesLoading }] = useLazyQuery(
    FindBranchesByDistanceDocument,
    { fetchPolicy: 'no-cache' }
  );
  const [getStock, { data: stockData }] = useLazyQuery(GetStockFromProductAndBranchIdDocument, {
    fetchPolicy: 'no-cache',
  });
  const [createPrice, { loading }] = useMutation(CreatePriceDocument, {
    refetchQueries: [
      StockDocument,
      GetProductStocksDocument,
      FavoriteBranchesWithPricesDocument,
      BranchesWithProductsDocument,
    ],
  });
  const [branchId, setBranchId] = useState<string>();
  const selectedBranch = useMemo(
    () =>
      branchId
        ? branchesData?.findBranchesByDistance?.find(({ id }) => branchId === String(id))
        : undefined,
    [branchId, branchesData]
  );
  const { location, getCurrentLocation } = useLocationService();

  const nextWeek = dayjs(new Date()).add(7, 'day').toDate();

  const stock = stockData?.getStockFromProductAndBranchId as Stock | undefined;

  useEffect(() => {
    if (!location) {
      getCurrentLocation({});
      return;
    }
    findBranchesByDistance({
      variables: {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        radiusMeters: isRoleAuthorized(UserRole.Admin, user.role) ? 18_000 : 500,
      },
    });
  }, [location, user]);

  useEffect(() => {
    if (!branchesData) return;
    setBranchId(branchesData.findBranchesByDistance.at(0)?.id?.toString());
  }, [branchesData]);

  useEffect(() => {
    if (!branchId) return;
    getStock({
      variables: {
        productId: product.id,
        branchId: +branchId,
      },
    });
  }, [branchId]);

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
    <View className="mb-10 flex gap-5">
      <View className="rounded-xl border-[1px] border-gray-200 bg-gray-50 p-3">
        <ProductItem
          product={{ ...product, stock: stockData?.getStockFromProductAndBranchId as Stock }}
          hideAddButton
          hideStoreInfo
          imgWidth={100}
        />
      </View>

      <View className="mb-7 flex flex-row items-center justify-center gap-2">
        {branchId && selectedBranch && (
          <Image
            src={createCloudinaryUrl(selectedBranch.store?.logo ?? '', 500, 500)}
            className="size-[55px] rounded-xl border-[1px] border-gray-200"
          />
        )}

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
          containerStyle={{ flex: 1 }}
        />
      </View>

      {branchId && (
        <Formik
          validateOnBlur
          validateOnChange
          validate={(values) => {
            const errors = {} as FormikErrors<CreatePrice>;
            if (values.amount <= 0) {
              errors.amount = 'Amount has to be higher than $0.00';
            }

            if (values.sale && values.originalPrice && values.originalPrice < values.amount) {
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
              expiresAt: nextWeek,
              unitType: 'item',
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
              <PriceForm formik={formik} latestPrice={stock?.latestPrice ?? undefined} />

              <View className="mt-7">
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
                      disabled={!formik.isValid}
                      text="Submit Price"
                      size="md"
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </Formik>
      )}
    </View>
  );
}

type PriceFormProps = {
  formik: FormikProps<CreatePrice>;
  latestPrice?: Price;
};

function PriceForm({ formik, latestPrice }: PriceFormProps) {
  const formikContext = useFormikContext<CreatePrice>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!latestPrice) return;

    formikContext.setValues({
      ...formikContext.values,
      amount: latestPrice.amount,
      outOfStock: latestPrice.outOfStock,
      sale: latestPrice.sale,
      originalPrice: latestPrice.originalPrice,
      condition: latestPrice.condition,
      unitType: latestPrice.unitType,
    });
  }, [latestPrice]);

  return (
    <>
      <View className="flex flex-row items-center justify-center gap-5">
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

        <View className="flex flex-row items-center gap-3">
          <Text className="text-4xl color-gray-300">/</Text>
          <Combobox
            showClear={false}
            initialValue={formik.values.unitType}
            onSelectItem={(i) => formik.setFieldValue('unitType', i?.id ?? 'item')}
            dataSet={['item', 'lb'].map((x) => ({ id: x, title: x }))}
            textInputProps={{
              autoCorrect: false,
              placeholder: 'Unit',
              value: formik.values.unitType,
              onChangeText: formik.handleChange('unitType'),
              onBlur: formik.handleBlur('condition'),
            }}
            inputContainerStylesExtras={{
              minWidth: 85,
              borderColor: 'transparent',
            }}
          />
        </View>
      </View>

      <View className="flex-row items-center justify-between gap-5">
        <Checkbox
          label="Sale"
          checked={formik.values.sale}
          onCheckedChange={(c) => {
            formik.setFieldValue('sale', c);
            if (!c) {
              // set sale values to zero
              formik.setFieldValue('originalPrice', undefined);
              formik.setFieldValue('condition', undefined);
              formik.validateForm();
            }
          }}
        />

        <Checkbox
          label="Out of stock"
          checked={formik.values.outOfStock ?? false}
          onCheckedChange={(c) => {
            formik.setFieldValue('outOfStock', c);
          }}
        />
      </View>

      {formik.values.sale && (
        <View>
          <View className="flex flex-row items-center justify-stretch gap-4">
            <CurrencyInput
              value={formik.values.originalPrice ?? null}
              onChangeValue={(v) => {
                formik.setFieldValue('originalPrice', v);
              }}
              onBlur={formik.handleBlur('originalPrice')}
              prefix="$"
              delimiter=","
              separator="."
              precision={2}
              minValue={0}
              maxValue={1000}
              renderTextInput={(props) => (
                <Input {...props} label="Original Price" placeholder="$ Amount" />
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
    </>
  );
}
