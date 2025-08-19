import { View } from 'react-native';

import PriceUserAndTimestamp from './PriceUserAndTimestamp';
import StockFull from './StockFull';

import { Stock } from '@/graphql/types/graphql';

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
