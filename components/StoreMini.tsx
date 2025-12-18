import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Store } from 'graphql-utils';
import { TouchableOpacity, Image, Text, View } from 'react-native';

import { Skeleton } from './ui/Skeleton';

import { createCloudinaryUrl } from '@/lib/files';

export type StoreMiniProps = {
  store: Store;
};

export default function StoreMini({ store: { id, name, logo } }: StoreMiniProps) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/(stores)/${id}`, { relativeToDirectory: false })}
      className="flex flex-col items-center gap-2">
      <Image src={createCloudinaryUrl(logo, 300, 300)} className="size-[40px] rounded-lg" />
      <Text className="text-xs" numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

export function StoreMiniShowMore() {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/(stores)`, { relativeToDirectory: false })}
      className="flex flex-col items-center gap-2">
      <View className="flex size-[40px] items-center justify-center rounded-lg border-[1px] border-gray-200 bg-gray-50">
        <Feather name="arrow-right" size={20} color="#374151" />
      </View>

      <Text className="text-xs" numberOfLines={1}>
        See All
      </Text>
    </TouchableOpacity>
  );
}

export function StoreMiniLoading() {
  return (
    <View className="flex flex-col items-center gap-2">
      <Skeleton className="size-[40px] rounded-lg" />
      <Skeleton className="h-3 w-[40px] rounded-md" />
    </View>
  );
}
