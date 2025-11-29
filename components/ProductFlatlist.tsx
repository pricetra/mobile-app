import { QueryResult } from '@apollo/client';
import { router } from 'expo-router';
import { ReactNode, useState } from 'react';
import {
  Platform,
  RefreshControl,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';

import ProductItem, { ProductItemLoading } from './ProductItem';
import PaginationSimple from './ui/PaginationSimple';

import { AllProductsQuery, Paginator, Product, QueryAllProductsArgs } from 'graphql-utils';

const itemDimension = 300;

export type ProductFlatlistProps = {
  products: Product[];
  paginator?: Paginator;
  handleRefresh: () => Promise<void | QueryResult<AllProductsQuery, QueryAllProductsArgs>>;
  setPage: (page: number) => void;
  style?: StyleProp<ViewStyle>;
  onItemPress?: (product: Product) => void;
  ListHeaderComponent?: ReactNode;
};

export default function ProductFlatlist({
  products,
  paginator,
  handleRefresh,
  setPage,
  style,
  onItemPress,
  ListHeaderComponent,
}: ProductFlatlistProps) {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <FlatGrid
      data={products}
      keyExtractor={({ id }, i) => `${id}-${i}`}
      indicatorStyle="black"
      spacing={20}
      itemDimension={itemDimension}
      ListHeaderComponent={() => ListHeaderComponent}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            if (onItemPress) onItemPress(item);
            router.push(`/(tabs)/(products)/${item.id}?stockId=${item.stock?.id}`, {
              relativeToDirectory: false,
            });
          }}
          className="mb-5">
          <ProductItem product={item} hideStoreInfo />
        </TouchableOpacity>
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => {
              handleRefresh().finally(() => setRefreshing(false));
            }, 500);
          }}
          colors={Platform.OS === 'ios' ? ['black'] : ['white']}
          progressBackgroundColor="#111827"
        />
      }
      ListFooterComponent={() => (
        <View className="mb-20 mt-5 p-5">
          {paginator && <PaginationSimple paginator={paginator} onPageChange={setPage} />}
        </View>
      )}
      contentContainerStyle={style}
    />
  );
}

export type ProductFlatlistLoadingProps = {
  count?: number;
  noPadding?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ProductFlatlistLoading({ count, style }: ProductFlatlistLoadingProps) {
  return (
    <FlatGrid
      keyExtractor={(n, i) => `product-item-loading-${n}-${i}`}
      spacing={20}
      itemDimension={itemDimension}
      data={Array(count)
        .fill(0)
        .map((n, i) => n + i)}
      renderItem={() => <ProductItemLoading />}
      contentContainerStyle={style}
    />
  );
}
