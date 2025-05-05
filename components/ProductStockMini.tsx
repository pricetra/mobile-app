import { Entypo } from '@expo/vector-icons';
import { random } from 'lodash';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import Image from '@/components/ui/Image';
import { Stock } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export type ProductStockMiniProps = {
  stock: Stock;
};

function metersToMiles(m: number) {
  return (m / 1609).toPrecision(2);
}

export default function ProductStockMini({ stock }: ProductStockMiniProps) {
  return (
    <View className="flex flex-row items-center gap-2">
      <Image
        src={createCloudinaryUrl(stock.store?.logo ?? '', 40, 40)}
        className="size-[25px] rounded-full"
      />
      <View>
        <Text className="text-xs font-semibold">{stock.store?.name}</Text>
        <View className="flex flex-row items-center gap-[1px]">
          <Text className="text-[9px]">{stock.branch?.address?.city}</Text>
          <>
            <Entypo name="dot-single" size={10} color="black" />
            <Text className="text-[9px]">
              {metersToMiles(stock.branch?.address?.distance ?? 0)} mi
            </Text>
          </>
        </View>
      </View>
    </View>
  );
}
