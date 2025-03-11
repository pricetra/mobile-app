import { View, Image, Text } from 'react-native';

import { Skeleton } from './ui/Skeleton';

import { Store } from '@/graphql/types/graphql';

export default function StoreItem({ name, logo, website }: Store) {
  return (
    <View className="mb-5 flex flex-row gap-3">
      <View className="flex flex-row gap-3">
        <Image
          source={{ uri: `https://res.cloudinary.com/pricetra-api/image/upload/${logo}` }}
          className="size-[93px] rounded-lg"
        />
      </View>

      <View className="flex flex-1 flex-col gap-3">
        <Text className="text-2xl font-bold">{name}</Text>

        <Text className="">{website}</Text>
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
