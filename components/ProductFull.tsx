import { Entypo } from '@expo/vector-icons';
import { Fragment } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity } from 'react-native';

import Image from './ui/Image';
import { Skeleton } from './ui/Skeleton';

import { Product } from '@/graphql/types/graphql';
import { categoriesFromChild } from '@/lib/utils';

export type ProductFullProps = {
  product: Product;
  onEditButtonPress?: () => void;
  hideDescription?: boolean;
  hideEditButton?: boolean;
};

export default function ProductFull({
  product,
  onEditButtonPress,
  hideDescription,
  hideEditButton,
}: ProductFullProps) {
  const { width } = useWindowDimensions();

  return (
    <View className="flex flex-col gap-3">
      <View className="relative mx-auto p-5" style={{ width: width / 1.5, height: width / 1.5 }}>
        {!hideEditButton && onEditButtonPress && (
          <View className="absolute right-7 top-7 z-50">
            <TouchableOpacity onPress={onEditButtonPress}>
              <View className="rounded-full bg-black/60 px-4 py-2">
                <Text className="text-center text-sm text-white">Edit</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <Image src={product.image} className="size-full rounded-xl" />
      </View>

      <View className="p-5">
        <View className="flex flex-col gap-2">
          <View className="mb-5 flex flex-row items-center gap-3">
            {product.weightValue && product.weightType && (
              <View className="rounded-full bg-green-300/30 px-3 py-1">
                <Text className="text-sm color-black">
                  {product.weightValue} {product.weightType}
                </Text>
              </View>
            )}
            {product.quantityValue && product.quantityType && (
              <View className="rounded-full bg-blue-300/30 px-3 py-1">
                <Text className="text-sm color-black">
                  {product.quantityValue} {product.quantityType}
                </Text>
              </View>
            )}
          </View>

          <View className="flex flex-row flex-wrap items-center gap-1">
            {product.brand && product.brand !== 'N/A' && <Text>{product.brand}</Text>}
          </View>

          <Text className="text-2xl font-semibold">{product.name}</Text>

          {product.category && (
            <View className="flex flex-row flex-wrap items-center gap-1">
              {categoriesFromChild(product.category).map((c, i) => (
                <Fragment key={c.id}>
                  {i !== 0 && <Entypo name="chevron-right" size={10} color="#4b5563" />}
                  <Text className="text-sm text-gray-600">{c.name}</Text>
                </Fragment>
              ))}
            </View>
          )}
        </View>

        {!hideDescription && product.description.length > 0 && (
          <View className="mt-10">
            <Text style={{ lineHeight: 19 }}>{product.description}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function ProductFullLoading() {
  const { width } = useWindowDimensions();
  return (
    <View className="flex flex-col gap-3">
      <View className="mx-auto p-5" style={{ width, height: width / 1.5 }}>
        <Skeleton className="h-full w-full rounded-xl bg-gray-400" />
      </View>

      <View className="p-5">
        <View className="flex flex-col gap-2">
          <View className="flex flex-row flex-wrap items-center gap-1">
            <Skeleton className="h-[18px] w-[100px]" />
          </View>
          <View className="flex flex-col gap-2">
            <Skeleton className="h-[25px] w-full" />
            <Skeleton className="h-[25px] w-full" />
          </View>
          <Skeleton className="h-[18px] w-1/2" />
        </View>

        <View className="mt-10 flex flex-col gap-2">
          <Skeleton className="h-[15px] w-full" />
          <Skeleton className="h-[15px] w-full" />
          <Skeleton className="h-[15px] w-1/2" />
        </View>
      </View>
    </View>
  );
}
