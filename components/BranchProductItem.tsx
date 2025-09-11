import { View, Text } from 'react-native';

import Image from '@/components/ui/Image';
import { Skeleton } from '@/components/ui/Skeleton';
import { Branch } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { metersToMiles } from '@/lib/utils';

export type BranchProductItemProps = {
  branch: Branch;
};

export default function BranchProductItem({ branch }: BranchProductItemProps) {
  return (
    <View>
      <View className="flex flex-row justify-between gap-5">
        <View className="flex flex-1 flex-row items-center gap-4">
          <Image
            src={createCloudinaryUrl(branch.store?.logo ?? '', 500, 500)}
            className="size-[40px] rounded-lg"
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 4,
              paddingRight: 60,
              flexWrap: 'wrap',
            }}>
            <View className="flex w-full flex-row flex-wrap items-center gap-3">
              <Text className="text-md font-bold">{branch.store?.name}</Text>
            </View>

            <View className="w-full">
              <Text className="text-xs">
                {branch.address?.street}, {branch.address?.city}
              </Text>
            </View>
          </View>
        </View>

        <View>
          {branch.address?.distance && (
            <Text className="mt-1 text-sm">{metersToMiles(branch.address.distance)} mi</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export function BranchProductItemLoading() {
  return (
    <View>
      <View className="flex flex-row justify-between gap-5">
        <View className="flex flex-1 flex-row items-center gap-4">
          <Skeleton className="size-[40px] rounded-lg" />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 4,
              paddingRight: 60,
              flexWrap: 'wrap',
            }}>
            <View className="flex w-full flex-row flex-wrap items-center gap-3">
              <Skeleton className="h-4 w-24 rounded-md" />
            </View>

            <View className="w-full">
              <Skeleton className="h-3 w-40 rounded-md" />
            </View>
          </View>
        </View>

        <View>
          <Skeleton className="mt-1 h-4 w-12 rounded-md" />
        </View>
      </View>
    </View>
  );
}
