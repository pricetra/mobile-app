import { Branch } from 'graphql-utils';
import { View, Text, FlatList } from 'react-native';

import MyBranchPanelItem from './MyBranchPanelItem';

import { cn } from '@/lib/utils';

export type MyBranchPanelProps = {
  myStoreUserBranches: Branch[];
};

export default function MyBranchPanel({ myStoreUserBranches }: MyBranchPanelProps) {
  return (
    <View className="mb-10">
      <View className="mb-3 px-5">
        <Text className="text-lg font-bold">My Stores</Text>
      </View>

      <FlatList
        horizontal
        data={myStoreUserBranches}
        keyExtractor={(item) => `mystoreuser-${item.id}`}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item: branch, index: i }) => (
          <View className={cn('pl-5', i === myStoreUserBranches.length - 1 ? 'pr-5' : '')}>
            <MyBranchPanelItem branch={branch} />
          </View>
        )}
        style={{ marginBottom: 15 }}
      />
    </View>
  );
}
