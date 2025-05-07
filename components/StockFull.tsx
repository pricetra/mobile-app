import { Entypo } from '@expo/vector-icons';
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
    <View className="flex flex-row items-center justify-between gap-5">
      <View className="flex flex-1 flex-row items-center gap-2">
        <Image
          src={createCloudinaryUrl(stock.store.logo, 500, 500)}
          className="size-[60px] rounded-lg"
        />
        <View className="flex flex-col gap-1">
          <Text className="text-lg font-semibold">{stock.store.name}</Text>
          <Text className="text-sm">{stock.branch.address?.fullAddress}</Text>
          {stock.branch.address?.distance && (
            <Text className="text-sm">{metersToMiles(stock.branch.address.distance)} mi</Text>
          )}
        </View>
      </View>

      {stock.latestPrice && stock.latestPrice && (
        <Text className="text-xl font-black">{currencyFormat(stock.latestPrice.amount)}</Text>
      )}
    </View>
  );
}
