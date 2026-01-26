import { router } from 'expo-router';
import { Branch } from 'graphql-utils';
import { View, Text, TouchableOpacity } from 'react-native';

import Image from '@/components/ui/Image';
import { createCloudinaryUrl } from '@/lib/files';

export type MyBranchPanelItemProps = {
  branch: Branch;
};

export default function MyBranchPanelItem({ branch }: MyBranchPanelItemProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}`, {
          relativeToDirectory: false,
        });
      }}
      className="min-h-28 rounded-lg bg-gray-100 p-5"
      style={{ width: 300 }}>
      <View className="flex flex-1 flex-row gap-4">
        <Image
          src={createCloudinaryUrl(branch.store?.logo ?? '', 500, 500)}
          className="size-[40px] rounded-xl"
        />
        <View className="flex flex-row flex-wrap gap-1 pr-16">
          <View className="flex w-full flex-row flex-wrap items-center gap-3">
            <Text className="text-base font-bold" numberOfLines={2}>
              {branch.name}
            </Text>
          </View>

          <View className="w-full">
            <Text className="text-xs" numberOfLines={1}>
              {branch.address?.fullAddress}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
