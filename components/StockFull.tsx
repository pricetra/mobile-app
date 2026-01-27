import dayjs from 'dayjs';
import { Stock } from 'graphql-utils';
import { View, Text } from 'react-native';

import { Skeleton } from './ui/Skeleton';

import Image from '@/components/ui/Image';
import useCalculatedPrice from '@/hooks/useCalculatedPrice';
import useIsSaleExpired from '@/hooks/useIsSaleExpired';
import { createCloudinaryUrl } from '@/lib/files';
import { currencyFormat, getPriceUnitOrEach } from '@/lib/strings';
import { metersToMiles } from '@/lib/utils';

export type StockFullProps = {
  stock: Stock;
  approximatePrice?: number;
  quantityValue?: number;
  quantityType?: string;
};

export default function StockFull({
  stock,
  approximatePrice,
  quantityValue,
  quantityType,
}: StockFullProps) {
  if (!stock.store || !stock.branch) throw new Error('stock has no store or branch objects');

  const isExpired = useIsSaleExpired(stock.latestPrice);
  const calculatedAmount = useCalculatedPrice({
    isExpired,
    latestPrice: stock.latestPrice,
  });

  return (
    <View className="flex flex-row justify-between gap-5">
      <View className="flex flex-1 flex-row gap-4">
        <Image
          src={createCloudinaryUrl(stock.store.logo, 500, 500)}
          className="size-[60px] rounded-xl"
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            flexWrap: 'wrap',
            flex: 1,
          }}>
          {stock.latestPrice?.sale && !isExpired && (
            <View className="w-[35px]">
              <Text className="inline-block rounded-md bg-red-700 px-1.5 py-1 text-center text-[9px] font-bold color-white">
                SALE
              </Text>
            </View>
          )}

          <View className="flex w-full flex-row items-center gap-2.5">
            <Text className="flex-1 text-lg font-bold" numberOfLines={1}>
              {stock.store.name}
            </Text>

            {stock.branch.address?.distance && (
              <View className="rounded-full bg-pricetraGreenDark/10 px-2 py-0.5">
                <Text className="text-xs color-pricetraGreenHeavyDark">
                  {metersToMiles(stock.branch.address.distance)} mi
                </Text>
              </View>
            )}
          </View>

          <View className="w-full">
            <Text className="text-xs">
              {stock.branch.address?.street}, {stock.branch.address?.city}
            </Text>
          </View>

          <View className="mt-1 flex flex-col gap-1">
            {stock.latestPrice?.sale && !isExpired && stock.latestPrice?.expiresAt && (
              <Text>
                <Text className="bg-blue-200/50 text-xs italic">
                  Valid until{' '}
                  <Text className="font-bold">
                    {dayjs(stock.latestPrice.expiresAt).format('LL')}
                  </Text>
                </Text>
              </Text>
            )}

            {!isExpired && stock.latestPrice?.condition && (
              <Text>
                <Text className="bg-yellow-200/50 text-xs italic">
                  *{stock.latestPrice.condition}
                </Text>
              </Text>
            )}
          </View>
        </View>
      </View>

      <View>
        <View
          className="flex w-fit flex-col items-end gap-0.5 py-3"
          style={{ opacity: stock.latestPrice?.outOfStock ? 0.5 : 1 }}>
          {stock?.latestPrice?.sale && !isExpired && stock.latestPrice.originalPrice && (
            <Text className="text text-right line-through color-red-700">
              {currencyFormat(stock.latestPrice.originalPrice)}
            </Text>
          )}

          {stock?.latestPrice?.amount && (
            <View className="flex flex-row items-center justify-start gap-1">
              <Text className="text-xl font-black">{currencyFormat(calculatedAmount)}</Text>
              <Text className="text-xs color-gray-500">
                {getPriceUnitOrEach(stock.latestPrice)}
              </Text>
            </View>
          )}

          {stock.latestPrice?.amount && quantityValue && quantityValue > 1 && (
            <Text className="text-right text-[10px] color-gray-500">
              {`${currencyFormat(calculatedAmount / quantityValue)}/${quantityType}`}
            </Text>
          )}

          {approximatePrice && (
            <Text className="text-xl">
              <Text className="text-xl font-black">{currencyFormat(approximatePrice)}</Text>*
            </Text>
          )}

          {!stock?.latestPrice?.amount && !approximatePrice && (
            <Text className="text-xl font-black">--</Text>
          )}
        </View>

        {stock.latestPrice?.outOfStock && (
          <View>
            <Text className="text-xs font-semibold color-black">
              <Text className="bg-red-200/50">*Out of Stock</Text>
            </Text>
          </View>
        )}

        {stock.available === false && (
          <View>
            <Text className="text-xs font-semibold color-black">
              <Text className="bg-red-200/50">*Unavailable</Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function StockFullLoading() {
  return (
    <View className="flex flex-row justify-between gap-5">
      <View className="flex flex-1 flex-row gap-4">
        <Skeleton className="size-[60px] rounded-xl" />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            flexWrap: 'wrap',
            flex: 1,
          }}>
          <View className="flex w-full flex-row items-center gap-2.5">
            <Skeleton className="h-[18px] w-[60%] rounded-lg" />
          </View>

          <View className="w-full">
            <Skeleton className="h-[12px] w-[80%] rounded-lg" />
          </View>
        </View>
      </View>

      <View className="flex w-fit flex-col items-end gap-0.5 py-3">
        <View className="flex flex-row items-center justify-start gap-1">
          <Skeleton className="h-[20px] w-[40px] rounded-lg" />
        </View>
      </View>
    </View>
  );
}
