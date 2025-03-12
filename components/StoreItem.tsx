import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Image, Text } from 'react-native';

import { Skeleton } from './ui/Skeleton';

import { Store } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export default function StoreItem({ name, logo, website }: Store) {
  return (
    <View className="mb-5 flex flex-row gap-3">
      <View className="flex flex-row gap-3">
        <Image
          source={{ uri: createCloudinaryUrl(logo, 120, 120) }}
          className="size-[93px] rounded-lg"
        />
      </View>

      <View className="flex flex-1 flex-col gap-2">
        <Text className="text-2xl font-bold">{name}</Text>

        <View className="flex flex-row items-center gap-1">
          <MaterialCommunityIcons name="earth" />
          <Text className="flex items-center">{website}</Text>
        </View>
      </View>
    </View>
  );
}

export function StoreItemLoading() {
  return (
    <View className="mb-5 flex flex-row gap-3">
      <View className="flex flex-row gap-3">
        <Skeleton className="size-[93px] rounded-lg" />
      </View>

      <View className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-[100px]" />
      </View>
    </View>
  );
}
