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

import ProductItem, { RenderProductLoadingItems } from './ProductItem';

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
  onItemLongPress?: (product: Product) => void;
  onItemPress?: (product: Product) => void;
};

export default function ProductFlatlist({
  products,
  paginator,
  handleRefresh,
  setPage,
  style,
  onItemLongPress,
  onItemPress,
}: ProductFlatlistProps) {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <FlatList
      data={products}
      keyExtractor={({ id }, i) => `${id}-${i}`}
      indicatorStyle="black"
      renderItem={({ item }) => (
        <View className="mb-10">
          <TouchableOpacity
            onPress={() => {
              if (onItemPress) onItemPress(item);
              router.push(`/(tabs)/(products)/${item.id}?stockId=${item.stock?.id}`);
            }}
            onLongPress={() => {
              if (onItemLongPress) onItemLongPress(item);
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
      onEndReached={() => {
        if (!paginator || !paginator.next) return;
        setPage(paginator.next);
      }}
      onEndReachedThreshold={5}
      className="p-5"
      ListFooterComponent={() => (
        <>
          {products.length > 0 && paginator?.next && (
            <RenderProductLoadingItems count={5} noPadding />
          )}
        </>
      )}
      style={style}
    />
  );
}
