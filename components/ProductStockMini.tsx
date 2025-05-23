import { Entypo } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import Image from '@/components/ui/Image';
import { Stock } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { metersToMiles } from '@/lib/utils';

export type ProductStockMiniProps = {
  stock: Stock;
};

export default function ProductStockMini({ stock }: ProductStockMiniProps) {
  return (
    <View className="flex flex-row items-center gap-2">
      <Image
        src={createCloudinaryUrl(stock.store?.logo ?? '', 100, 100)}
        className="size-[25px] rounded-full"
      />
      <View>
        <Text className="text-xs font-semibold">{stock.store?.name}</Text>
        {stock.branch?.address && (
          <View className="flex flex-row flex-wrap items-center gap-[1px]">
            <Text className="text-[9px]">{stock.branch.address?.city}</Text>
            {stock.branch.address.distance && (
              <Text className="text-[9px]">
                ({metersToMiles(stock.branch.address.distance)} mi)
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
