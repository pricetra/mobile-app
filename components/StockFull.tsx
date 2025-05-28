import { View, Text } from 'react-native';

import Image from '@/components/ui/Image';
import { Stock } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { currencyFormat } from '@/lib/strings';
import { metersToMiles } from '@/lib/utils';

export type StockFullProps = {
  stock: Stock;
};

export default function StockFull({ stock }: StockFullProps) {
  if (!stock.store || !stock.branch) throw new Error('stock has no store or branch objects');

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
            <Text className="text-lg font-semibold">{stock.store.name}</Text>

            {stock.latestPrice?.sale && (
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

          {stock.latestPrice?.condition && (
            <Text className="mt-3 text-xs italic color-gray-700">
              *{stock.latestPrice.condition}
            </Text>
          )}
        </View>
      </View>

      {stock.latestPrice && stock.latestPrice && (
        <View className="flex w-fit flex-col items-end gap-0.5 py-3">
          {stock.latestPrice.sale && stock.latestPrice.originalPrice && (
            <Text className="text text-right line-through color-red-700">
              {currencyFormat(stock.latestPrice.originalPrice)}
            </Text>
          )}

          <Text className="text-xl font-black">{currencyFormat(stock.latestPrice.amount)}</Text>
        </View>
      )}
    </View>
  );
}
