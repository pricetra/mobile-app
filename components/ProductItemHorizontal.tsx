import { View, Text } from 'react-native';

import { ProductItemOptionalProps } from './ProductItem';
import ProductMetadataBadge from './ProductMetadataBadge';
import AddToGroceryListActionButton from './ui/AddToGroceryListActionButton';
import { Skeleton } from './ui/Skeleton';

import Image from '@/components/ui/Image';
import { Product, ProductSimple } from '@/graphql/types/graphql';
import useCalculatedPrice from '@/hooks/useCalculatedPrice';
import useIsSaleExpired from '@/hooks/useIsSaleExpired';
import useProductWeightBuilder from '@/hooks/useProductWeightBuilder';
import { createCloudinaryUrl } from '@/lib/files';
import { currencyFormat, getPriceUnit } from '@/lib/strings';

export type ProductItemHorizontalProps = ProductItemOptionalProps & {
  product: ProductSimple | Product;
};

export default function ProductItemHorizontal({
  product,
  imgWidth = 130,
  hideAddButton = false,
  hideStoreInfo = true,
}: ProductItemHorizontalProps) {
  const isExpired = useIsSaleExpired(product.stock?.latestPrice);
  const calculatedAmount = useCalculatedPrice({
    isExpired,
    latestPrice: product.stock?.latestPrice,
  });
  const weight = useProductWeightBuilder(product, true);

  return (
    <View className="flex flex-col gap-2">
      <View style={{ position: 'relative' }}>
        {product.stock?.latestPrice?.sale && !isExpired && (
          <View className="absolute left-1 top-1 z-[1] w-[40px]">
            <Text className="inline-block rounded-md bg-red-700 px-1.5 py-1 text-center text-[9px] font-bold color-white">
              SALE
            </Text>
          </View>
        )}

        {!hideAddButton && <AddToGroceryListActionButton productId={product.id} />}

        <Image
          src={createCloudinaryUrl(product.code, 500)}
          className="rounded-xl"
          style={{ maxWidth: imgWidth, height: imgWidth }}
        />
      </View>
      <View className="flex flex-col justify-between gap-2">
        <View className="flex flex-col gap-1">
          <View className="mb-1 flex flex-row items-center gap-1">
            {product.weightValue && product.weightType && (
              <ProductMetadataBadge type="weight" size="sm" text={weight} />
            )}
            {product.quantityValue && product.quantityType && (
              <ProductMetadataBadge
                type="quantity"
                size="sm"
                text={`${product.quantityValue} ${product.quantityType}`}
              />
            )}
          </View>

          <View className="flex flex-row flex-wrap items-center gap-2">
            {product.brand && product.brand !== 'N/A' && (
              <Text className="text-[10px] text-gray-600">{product.brand}</Text>
            )}
          </View>
          <Text numberOfLines={2}>{product.name}</Text>
        </View>

        {product.stock?.latestPrice && (
          <View className="flex flex-row justify-between gap-2">
            {!hideStoreInfo && product.__typename === 'Product' && product.stock.store && (
              <View>
                <Image
                  src={createCloudinaryUrl(product.stock.store.logo ?? '', 100, 100)}
                  className="size-[25px] rounded-sm"
                />
              </View>
            )}

            <View className="flex-[1] flex-col">
              {product.stock.latestPrice.sale &&
                !isExpired &&
                product.stock.latestPrice.originalPrice && (
                  <Text className="text-xs line-through color-red-700">
                    {currencyFormat(product.stock.latestPrice.originalPrice)}
                  </Text>
                )}
              <View className="flex flex-row items-center justify-start gap-1">
                <Text className="text-lg font-black">{currencyFormat(calculatedAmount)}</Text>
                <Text className="text-xs color-gray-500">
                  {getPriceUnit(product.stock.latestPrice)}
                </Text>
              </View>
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

export function ProductLoadingItemHorizontal({ imgWidth = 130 }: { imgWidth?: number }) {
  return (
    <View className="flex max-w-full flex-col gap-2">
      <View style={{ width: imgWidth, height: imgWidth }}>
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
