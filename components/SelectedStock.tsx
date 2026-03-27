import { FontAwesome6 } from '@expo/vector-icons';
import { Product, Stock } from 'graphql-utils';
import { Linking, View } from 'react-native';

import PriceUserAndTimestamp from './PriceUserAndTimestamp';
import StockFull, { StockFullLoading } from './StockFull';
import Btn from './ui/Btn';
import { Skeleton } from './ui/Skeleton';

export type SelectedStockProps = {
  stock: Stock;
  product: Product;
};

export default function SelectedStock(props: SelectedStockProps) {
  const { stock } = props;
  if (!stock.store || !stock.branch) throw new Error('stock has no store or branch objects');

  return (
    <View className="flex flex-col gap-2">
      <StockFull {...props} />

      <View className="mt-4 flex flex-row flex-wrap gap-3">
        {stock.updatedBy && (
          <View>
            <PriceUserAndTimestamp
              user={stock.updatedBy}
              timestamp={stock.latestPrice?.createdAt ?? stock.updatedAt}
              verified={stock.latestPrice?.verified}
            />
          </View>
        )}

        {stock.onlineItem && (
          <View className="flex flex-1 flex-row justify-end">
            <Btn
              onPress={() => {
                if (!stock.onlineItem?.url) return;
                Linking.openURL(stock.onlineItem.url);
              }}
              bgColor="bg-white"
              color="text-black"
              className="border border-gray-200"
              size="xs"
              text="View Online"
              iconRight
              icon={<FontAwesome6 name="arrow-up-right-from-square" size={11} color="black" />}
            />
          </View>
        )}
      </View>
    </View>
  );
}

export function SelectedStockLoading() {
  return (
    <View className="flex flex-col gap-2">
      <StockFullLoading />

      <View className="mt-4">
        <Skeleton className="h-[30px] w-[30%] rounded-full" />
      </View>
    </View>
  );
}
