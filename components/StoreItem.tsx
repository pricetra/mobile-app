import { Feather } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import { Skeleton } from './ui/Skeleton';

import Image from '@/components/ui/Image';
import { Store } from 'graphql-utils';
import { createCloudinaryUrl } from '@/lib/files';

export default function StoreItem({ name, logo }: Store) {
  return (
    <View className="mb-8 flex flex-row items-center justify-between gap-3">
      <View className="flex flex-1 flex-row items-center gap-3">
        <View className="flex flex-row gap-3">
          <Image src={createCloudinaryUrl(logo, 500, 500)} className="size-[40px] rounded-lg" />
        </View>

        <View className="flex flex-1 flex-col gap-2">
          <Text className="text-lg">{name}</Text>
        </View>
      </View>

      <View>
        <Feather name="chevron-right" size={20} color="black" />
      </View>
    </View>
  );
}

export function StoreItemLoading() {
  return (
    <View className="mb-8 flex flex-row items-center gap-3">
      <View className="flex flex-row gap-3">
        <Skeleton className="size-[40px] rounded-lg" />
      </View>

      <View className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-4 max-w-[200px]" />
      </View>
    </View>
  );
}
