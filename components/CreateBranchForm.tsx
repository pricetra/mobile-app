import { ApolloError, useMutation } from '@apollo/client';
import * as Addresser from 'addresser';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  AllBranchesDocument,
  CreateBranchDocument,
  CreateBranchMutation,
  FindStoreDocument,
  Store,
} from '@/graphql/types/graphql';
import { mapsApiClient } from '@/lib/maps-api';

export type CreateBranchFormProps = {
  onSuccess?: (data: CreateBranchMutation) => void;
  onError?: (err: ApolloError) => void;
  store: Store;
};

export default function CreateBranchForm({ store, onSuccess, onError }: CreateBranchFormProps) {
  const [fullAddress, setFullAddress] = useState('');
  const [createBranch, { data, loading, error }] = useMutation(CreateBranchDocument, {
    refetchQueries: [AllBranchesDocument, FindStoreDocument],
  });
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (onSuccess) onSuccess(data);
  }, [data]);

  useEffect(() => {
    if (!error) return;
    if (onError) onError(error);
  }, [error]);

  function search() {
    setSearching(true);

    mapsApiClient
      .geocode({
        params: {
          address: fullAddress,
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
        },
      })
      .then(({ data }) => {
        const res = data.results[0];
        const latitude = res.geometry.location.lat;
        const longitude = res.geometry.location.lng;
        const placeId = res.place_id;
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude}%2C${longitude}&query_place_id=${placeId}`;

        const parsedAddress = Addresser.parseAddress(fullAddress);
        createBranch({
          variables: {
            input: {
              name: `${store.name} ${parsedAddress.placeName}`,
              storeId: store.id,
              address: {
                administrativeDivision: parsedAddress.stateName,
                city: parsedAddress.placeName,
                countryCode: 'US',
                fullAddress: res.formatted_address,
                latitude,
                longitude,
                mapsLink,
                zipCode: +parsedAddress.zipCode,
              },
            },
          },
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setSearching(false));
  }

  return (
    <View className="flex flex-col gap-6">
      <Input
        placeholder="Address (Ex. 801 N Randall Rd, Batavia, IL 60510, USA)"
        onChangeText={setFullAddress}
        value={fullAddress}
        autoCorrect
        autoFocus
        editable={!loading && !searching}
      />

      <Button
        onPress={search}
        loading={loading || searching}
        disabled={!fullAddress}
        variant="secondary">
        Submit
      </Button>
    </View>
  );
}
