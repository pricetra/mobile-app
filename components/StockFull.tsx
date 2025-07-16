import dayjs from 'dayjs';
import { useMemo } from 'react';
import { View, Text } from 'react-native';

import Image from '@/components/ui/Image';
import { Stock } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { currencyFormat } from '@/lib/strings';
import { isSaleExpired, metersToMiles } from '@/lib/utils';

export type StockFullProps = {
  stock: Stock;
  approximatePrice?: number;
};

export default function StockFull({ stock, approximatePrice }: StockFullProps) {
  if (!stock.store || !stock.branch) throw new Error('stock has no store or branch objects');

  const isExpired = useMemo(
    () => (stock.latestPrice ? isSaleExpired(stock.latestPrice) : false),
    [stock.latestPrice]
  );

  return (
    <View className="flex flex-row justify-between gap-5">
      <View className="flex flex-1 flex-row gap-4">
        <Image
          src={createCloudinaryUrl(stock.store.logo, 500, 500)}
          className="size-[60px] rounded-lg"
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            paddingRight: 60,
            flexWrap: 'wrap',
          }}>
          <View className="flex w-full flex-row flex-wrap items-center gap-3">
            <Text className="text-lg font-bold">{stock.store.name}</Text>

            {stock.latestPrice?.sale && !isExpired && (
              <View className="w-[35px]">
                <Text className="inline-block rounded-md bg-red-700 px-1.5 py-1 text-center text-[9px] font-bold color-white">
                  SALE
                </Text>
              </View>
            )}
          </View>

          <View className="w-full">
            <Text className="text-xs">{stock.branch.address?.fullAddress}</Text>

            {stock.branch.address?.distance && (
              <Text className="mt-1 text-xs">
                {metersToMiles(stock.branch.address.distance)} mi
              </Text>
            )}
          </View>

          <View className="mt-1 flex flex-col gap-1">
            {!isExpired && stock.latestPrice?.expiresAt && (
              <Text className="text-xs italic">
                Valid until {dayjs(stock.latestPrice.expiresAt).format('LL')}
              </Text>
            )}

            {!isExpired && stock.latestPrice?.condition && (
              <Text className="text-xs italic color-gray-700">*{stock.latestPrice.condition}</Text>
            )}
          </View>
        </View>
      </View>

      <View className="flex w-fit flex-col items-end gap-0.5 py-3">
        {stock?.latestPrice?.sale && !isExpired && stock.latestPrice.originalPrice && (
          <Text className="text text-right line-through color-red-700">
            {currencyFormat(stock.latestPrice.originalPrice)}
          </Text>
        )}

        {stock?.latestPrice?.amount && (
          <Text className="text-xl font-black">
            {!isExpired
              ? currencyFormat(stock.latestPrice.amount)
              : currencyFormat(stock.latestPrice?.originalPrice ?? stock.latestPrice.amount)}
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
    </View>
  );
}
