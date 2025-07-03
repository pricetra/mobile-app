import { View, Text } from 'react-native';

import Image from '@/components/ui/Image';
import { Branch } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { metersToMiles } from '@/lib/utils';

export type BranchItemWithLogoProps = {
  branch: Branch;
};

export default function BranchItemWithLogo({ branch }: BranchItemWithLogoProps) {
  return (
    <View className="flex flex-row justify-between gap-5">
      <View className="flex flex-1 flex-row gap-4">
        <Image
          src={createCloudinaryUrl(branch.store?.logo ?? '', 500, 500)}
          className="size-[60px] rounded-lg"
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
            <Text className="text-lg font-bold">{branch.store?.name}</Text>
          </View>

          <View className="w-full">
            <Text className="text-xs">{branch.address?.fullAddress}</Text>

            {branch.address?.distance && (
              <Text className="mt-1 text-xs">{metersToMiles(branch.address.distance)} mi</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
