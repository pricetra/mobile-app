import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { View, TextInput } from 'react-native';
import CurrencyInput from 'react-native-currency-input';

import Button from '../ui/Button';
import Combobox from '../ui/Combobox';

import {
  CreatePriceDocument,
  FindBranchesByDistanceDocument,
  GetProductStocksDocument,
  Price,
  Product,
} from '@/graphql/types/graphql';
import useCurrentLocation from '@/hooks/useCurrentLocation';

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
  const [amount, setAmount] = useState<number>(0);
  const [branchId, setBranchId] = useState<string>();
  const { location } = useCurrentLocation();

  useEffect(() => {
    if (!location) return;
    findBranchesByDistance({
      variables: {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        radiusMeters: 3000, // TODO: Ideally use 500 meters as the radius
      },
    });
  }, [location]);

  useEffect(() => {
    if (!branchesData) return;
    setBranchId(branchesData.findBranchesByDistance.at(0)?.id);
  }, [branchesData]);

  function onSubmit() {
    if (!branchId || !amount) return;

    createPrice({
      variables: {
        input: {
          amount,
          productId: product.id,
          branchId,
        },
      },
    })
      .then(({ data }) => {
        if (!data) return;
        onSuccess(data.createPrice as Price);
      })
      .catch((e) => onError(e));
  }

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
        }))}
        onSelectItem={(data) => {
          if (!data) return;
          setBranchId(data.id);
        }}
        textInputProps={{
          placeholder: 'Select Branch',
        }}
      />

      <CurrencyInput
        value={amount}
        onChangeValue={(v) => {
          setAmount(v ?? 0);
        }}
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

      <Button
        className="mt-5"
        variant="secondary"
        loading={loading}
        onPress={onSubmit}
        disabled={!amount || !branchId}>
        Submit Price
      </Button>
    </View>
  );
}
