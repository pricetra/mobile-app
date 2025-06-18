import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import { Skeleton } from './ui/Skeleton';

import Image from '@/components/ui/Image';
import { Store } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export default function StoreItem({ name, logo, website }: Store) {
  return (
    <View className="mb-8 flex flex-row gap-3">
      <View className="flex flex-row gap-3">
        <Image src={createCloudinaryUrl(logo, 500, 500)} className="size-[60px] rounded-lg" />
      </View>

      <View className="flex flex-1 flex-col gap-2">
        <Text className="text-xl font-bold">{name}</Text>

        <View className="flex flex-row items-center gap-1">
          <MaterialCommunityIcons name="earth" color="#374151" />
          <Text className="flex items-center text-sm color-gray-700">{website}</Text>
        </View>
      </View>
    </View>
  );
}

export function StoreItemLoading() {
  return (
    <View className="mb-8 flex flex-row gap-3">
      <View className="flex flex-row gap-3">
        <Skeleton className="size-[60px] rounded-lg" />
      </View>

      <View className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-4 max-w-[200px]" />
        <Skeleton className="h-4 max-w-[100px]" />
      </View>
    </View>
  );
}
