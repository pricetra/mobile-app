import { QueryResult } from '@apollo/client';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import ProductItem from './ProductItem';
import PaginationSimple from './ui/PaginationSimple';

import {
  AllProductsQuery,
  Paginator,
  Product,
  QueryAllProductsArgs,
} from '@/graphql/types/graphql';

export type ProductFlatlistProps = {
  products: Product[];
  paginator?: Paginator;
  handleRefresh: () => Promise<void | QueryResult<AllProductsQuery, QueryAllProductsArgs>>;
  setPage: (page: number) => void;
  style?: StyleProp<ViewStyle>;
  onItemPress?: (product: Product) => void;
};

export default function ProductFlatlist({
  products,
  paginator,
  handleRefresh,
  setPage,
  style,
  onItemPress,
}: ProductFlatlistProps) {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <FlatList
      data={products}
      keyExtractor={({ id }, i) => `${id}-${i}`}
      indicatorStyle="black"
      renderItem={({ item }) => (
        <View className="p-5">
          <TouchableOpacity
            onPress={() => {
              if (onItemPress) onItemPress(item);
              router.push(`/(tabs)/(products)/${item.id}?stockId=${item.stock?.id}`);
            }}>
            <ProductItem product={item} />
          </TouchableOpacity>
        </View>
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
      style={style}
    />
  );
}
