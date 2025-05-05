import { ApolloError, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  AllBranchesDocument,
  CreateBranchFromFullAddressDocument,
  CreateBranchFromFullAddressMutation,
  FindStoreDocument,
  Store,
} from '@/graphql/types/graphql';

export type CreateBranchFormProps = {
  onSuccess?: (data: CreateBranchFromFullAddressMutation) => void;
  onError?: (err: ApolloError) => void;
  store: Store;
};

export default function CreateBranchForm({ store, onSuccess, onError }: CreateBranchFormProps) {
  const [fullAddress, setFullAddress] = useState('');
  const [createBranch, { data, loading, error }] = useMutation(
    CreateBranchFromFullAddressDocument,
    {
      refetchQueries: [AllBranchesDocument, FindStoreDocument],
    }
  );

  useEffect(() => {
    if (!data) return;
    if (onSuccess) onSuccess(data);
  }, [data]);

  useEffect(() => {
    if (!error) return;
    if (onError) onError(error);
  }, [error]);

  function search() {
    createBranch({
      variables: {
        storeId: store.id,
        fullAddress,
      },
    });
  }

  return (
    <View className="flex flex-col gap-6">
      <Input
        placeholder="Address (Ex. 801 N Randall Rd, Batavia, IL 60510, USA)"
        onChangeText={setFullAddress}
        value={fullAddress}
        autoCorrect
        autoFocus
        editable={!loading}
      />

      <Button onPress={search} loading={loading} disabled={!fullAddress} variant="secondary">
        Submit
      </Button>
    </View>
  );
}
