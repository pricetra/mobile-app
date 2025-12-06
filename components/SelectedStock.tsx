import { View } from 'react-native';

import PriceUserAndTimestamp from './PriceUserAndTimestamp';
import StockFull, { StockFullLoading } from './StockFull';
import { Skeleton } from './ui/Skeleton';

import { Stock } from 'graphql-utils';

export type SelectedStockProps = {
  stock: Stock;
  quantityValue?: number;
  quantityType?: string;
};

export default function SelectedStock(props: SelectedStockProps) {
  const { stock } = props;
  if (!stock.store || !stock.branch) throw new Error('stock has no store or branch objects');

  return (
    <View className="flex flex-col gap-2">
      <StockFull {...props} />

      {stock.updatedBy && (
        <View className="mt-4">
          <PriceUserAndTimestamp
            user={stock.updatedBy}
            timestamp={stock.latestPrice?.createdAt ?? stock.updatedAt}
          />
        </View>
      )}
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
