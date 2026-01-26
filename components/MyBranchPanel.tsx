import { View, Text, FlatList } from 'react-native';

import MyBranchPanelItem from './MyBranchPanelItem';

import useStoreUserBranches from '@/hooks/useStoreUser';
import { cn } from '@/lib/utils';

export default function MyBranchPanel() {
  const myStoreUserBranches = useStoreUserBranches();

  if (!myStoreUserBranches || myStoreUserBranches.length === 0) return <></>;

  return (
    <View className="mb-10">
      <View className="mb-3 px-5">
        <Text className="text-lg font-bold">Manage My Stores</Text>
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
