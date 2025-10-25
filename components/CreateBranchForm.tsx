import { ApolloError, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import Btn from './ui/Btn';

import { Input } from '@/components/ui/Input';
import {
  AllBranchesDocument,
  BranchesWithProductsDocument,
  CreateBranchFromFullAddressDocument,
  CreateBranchFromFullAddressMutation,
  Store,
} from '@/graphql/types/graphql';

export type CreateBranchFormProps = {
  onSuccess?: (data: CreateBranchFromFullAddressMutation) => void;
  onError?: (err: ApolloError) => void;
  store: Store;
  onCloseModal: () => void;
};

export default function CreateBranchForm({
  store,
  onSuccess,
  onError,
  onCloseModal,
}: CreateBranchFormProps) {
  const [fullAddress, setFullAddress] = useState('');
  const [createBranch, { data, loading, error }] = useMutation(
    CreateBranchFromFullAddressDocument,
    {
      refetchQueries: [AllBranchesDocument, BranchesWithProductsDocument],
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

      <View className="mt-3 flex flex-row items-center gap-3">
        <Btn
          onPress={onCloseModal}
          disabled={loading}
          text="Cancel"
          size="md"
          bgColor="bg-gray-100"
          color="text-gray-700"
        />

        <View className="flex-1">
          <Btn
            onPress={() => {
              createBranch({
                variables: {
                  storeId: store.id,
                  fullAddress,
                },
              });
            }}
            loading={loading}
            disabled={!fullAddress}
            size="md"
            text="Create Branch"
          />
        </View>
      </View>

      <View style={{ height: 50 }} />
    </View>
  );
}
