import { useLazyQuery } from '@apollo/client';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import BranchItemWithLogo from './BranchItemWithLogo';

import { Branch, GetAllBranchListsByListIdDocument } from '@/graphql/types/graphql';

export type BranchListViewProps = {
  listId: string;
};

export default function BranchListView({ listId }: BranchListViewProps) {
  const [getBranches, { data, loading, error }] = useLazyQuery(GetAllBranchListsByListIdDocument, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    getBranches({
      variables: { listId: +listId },
    });
  }, [listId]);

  return (
    <ScrollView className="p-5">
      {loading && (
        <View className="flex h-[100px] items-center justify-center">
          <ActivityIndicator color="black" />
        </View>
      )}
      {error && <Text>{error.message}</Text>}
      {data?.getAllBranchListsByListId.map((bList) => {
        if (!bList.branch) return <></>;

        const branch = { ...(bList.branch as Branch) };
        return (
          <TouchableOpacity
            key={bList.id}
            className="mb-7"
            onPress={() => router.push(`/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}`)}>
            <BranchItemWithLogo branch={branch} />
          </TouchableOpacity>
        );
      })}

      <View className="h-[200px]" />
    </ScrollView>
  );
}
