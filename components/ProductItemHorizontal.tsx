import { useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';

import { Skeleton } from './ui/Skeleton';

import Image from '@/components/ui/Image';
import { Product } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { currencyFormat } from '@/lib/strings';
import { isSaleExpired } from '@/lib/utils';

export type ProductItemHorizontalProps = {
  product: Product;
};

export default function ProductItemHorizontal({ product }: ProductItemHorizontalProps) {
  const { width } = useWindowDimensions();
  const isExpired = useMemo(
    () => (product.stock?.latestPrice ? isSaleExpired(product.stock.latestPrice) : false),
    [product.stock?.latestPrice]
  );
  const calculatedAmount = useMemo(() => {
    if (!product.stock?.latestPrice) return 0;
    return !isExpired
      ? product.stock.latestPrice.amount
      : (product.stock.latestPrice.originalPrice ?? product.stock.latestPrice.amount);
  }, [product.stock?.latestPrice, isExpired]);

  return (
    <View className="flex max-w-full flex-col gap-2" style={{ width: width / 3 }}>
      <View style={{ position: 'relative', width: width / 3, height: width / 3 }}>
        {product.stock?.latestPrice?.sale && !isExpired && (
          <View className="absolute left-1 top-1 z-[1] w-[40px]">
            <Text className="inline-block rounded-md bg-red-700 px-1.5 py-1 text-center text-[9px] font-bold color-white">
              SALE
            </Text>
          </View>
        )}
        <Image
          src={createCloudinaryUrl(product.code, 500)}
          className="rounded-xl"
          style={{ width: width / 3, height: width / 3 }}
        />
      </View>
      <View className="flex max-w-full flex-1 flex-col justify-between gap-2 px-2">
        <View className="flex flex-col gap-1">
          <View className="mb-1 flex flex-row items-center gap-1">
            {product.weightValue && product.weightType && (
              <View className="rounded-full bg-green-300/30 px-2 py-1">
                <Text className="text-[9px] color-black">
                  {product.weightValue} {product.weightType}
                </Text>
              </View>
            )}
            {product.quantityValue && product.quantityType && (
              <View className="rounded-full bg-blue-300/30 px-2 py-1">
                <Text className="text-[9px] color-black">
                  {product.quantityValue} {product.quantityType}
                </Text>
              </View>
            )}
          </View>

          <View className="flex flex-row flex-wrap items-center gap-2">
            {product.brand && product.brand !== 'N/A' && (
              <Text className="text-[10px]">{product.brand}</Text>
            )}
          </View>
          <Text numberOfLines={2}>{product.name}</Text>
        </View>

        {product.stock?.latestPrice && (
          <View className="flex flex-row items-center justify-between gap-2">
            <View className="flex-[1] flex-col">
              {product.stock.latestPrice.sale &&
                !isExpired &&
                product.stock.latestPrice.originalPrice && (
                  <Text className="text-xs line-through color-red-700">
                    {currencyFormat(product.stock.latestPrice.originalPrice)}
                  </Text>
                )}
              <Text className="text-lg font-black">{currencyFormat(calculatedAmount)}</Text>
              {product.quantityValue > 1 && (
                <Text className="text-[10px] color-gray-500">
                  {`${currencyFormat(calculatedAmount / product.quantityValue)}/${product.quantityType}`}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

export function ProductLoadingItemHorizontal() {
  const { width } = useWindowDimensions();

  return (
    <View className="flex max-w-full flex-col gap-2" style={{ width: width / 3 }}>
      <View style={{ width: width / 3, height: width / 3 }}>
        <Skeleton className="size-full rounded-xl" />
      </View>
      <View className="max-w-full flex-1 gap-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="mt-5 h-6 w-[100px]" />
      </View>
    </View>
  );
}

export type RenderProductLoadingItemsHorizontalProps = { count?: number; noPadding?: boolean };

export function RenderProductLoadingItemsHorizontal({
  count = 5,
  noPadding = false,
}: RenderProductLoadingItemsHorizontalProps) {
  return (
    <View style={{ padding: noPadding ? 0 : 20 }}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <View className="mb-10" key={i}>
            <ProductLoadingItemHorizontal />
          </View>
        ))}
    </View>
  );
}
