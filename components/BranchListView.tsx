import { useLazyQuery } from '@apollo/client';
import { router } from 'expo-router';
import { Branch, GetAllBranchListsByListIdDocument } from 'graphql-utils';
import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import BranchItemWithLogo, { BranchItemWithLogoLoading } from './BranchItemWithLogo';

export type BranchListViewProps = {
  listId: string;
};

export default function BranchListView({ listId }: BranchListViewProps) {
  const [getBranches, { data, loading, error }] = useLazyQuery(GetAllBranchListsByListIdDocument, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getBranches({
      variables: { listId: +listId },
    });
  }, [listId]);

  return (
    <ScrollView className="p-5 pt-10">
      {loading && (
        <>
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <View className="mb-10" key={`branch-loading-${i}`}>
                <BranchItemWithLogoLoading />
              </View>
            ))}
        </>
      )}
      {error && <Text>{error.message}</Text>}
      {data?.getAllBranchListsByListId.map((bList) => {
        if (!bList.branch) return <></>;

        const branch = { ...(bList.branch as Branch) };
        return (
          <TouchableOpacity
            key={bList.id}
            className="mb-7"
            onPress={() =>
              router.push(`/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}`, {
                relativeToDirectory: false,
              })
            }>
            <BranchItemWithLogo branch={branch} />
          </TouchableOpacity>
        );
      })}

      <View className="h-[200px]" />
    </ScrollView>
  );
}
