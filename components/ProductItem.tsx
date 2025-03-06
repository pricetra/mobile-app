import { View, Image, Text } from 'react-native';

import { Skeleton } from './ui/Skeleton';

import { Product } from '@/graphql/types/graphql';

export default function ProductItem({ image, name }: Product) {
  return (
    <View className="mb-10 flex max-w-full flex-row gap-2">
      {image !== '' ? (
        <Image
          source={{
            uri: image,
          }}
          className="size-28 rounded-lg"
        />
      ) : (
        <View className="size-28 rounded-lg bg-gray-300" />
      )}
      <View className="max-w-full flex-1 gap-2 p-2">
        <Text className="font-bold">{name}</Text>
      </View>
    </View>
  );
}

export function ProductLoadingItem() {
  return (
    <View className="mb-10 flex flex-row items-center gap-4">
      <Skeleton className="size-28 rounded-lg" />
      <View className="gap-2">
        <Skeleton className="h-4 max-w-[250px]" />
        <Skeleton className="h-4 max-w-[200px]" />
      </View>
    </View>
  );
}
