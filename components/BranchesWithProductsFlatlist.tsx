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

import BranchProductItem, { BranchProductItemLoading } from './BranchProductItem';
import { RenderProductLoadingItems } from './ProductItem';
import ProductItemHorizontal, { ProductLoadingItemHorizontal } from './ProductItemHorizontal';

import {
  Branch,
  BranchesWithProductsQuery,
  Paginator,
  QueryBranchesWithProductsArgs,
} from '@/graphql/types/graphql';

export type BranchesWithProductsFlatlistProps = {
  branches: Branch[];
  paginator?: Paginator;
  handleRefresh: () => Promise<void | QueryResult<
    BranchesWithProductsQuery,
    QueryBranchesWithProductsArgs
  >>;
  setPage: (page: number) => void;
  style?: StyleProp<ViewStyle>;
};

export default function BranchesWithProductsFlatlist({
  branches,
  paginator,
  handleRefresh,
  setPage,
  style,
}: BranchesWithProductsFlatlistProps) {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <FlatList
      data={branches}
      keyExtractor={({ id }, i) => `${id}-${i}`}
      indicatorStyle="black"
      renderItem={({ item: branch }) =>
        branch.products?.length ? (
          <View className="mb-5">
            <View className="px-5 py-3">
              <TouchableOpacity
                onPress={() => {
                  router.push(`/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}`);
                }}>
                <BranchProductItem branch={branch} />
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={branch.products}
              keyExtractor={({ id }, i) => `${id}-${i}`}
              renderItem={({ item: product }) => (
                <TouchableOpacity
                  className="mr-5"
                  onPress={() => {
                    router.push(`/(tabs)/(products)/${product.id}?stockId=${product.stock?.id}`);
                  }}>
                  <ProductItemHorizontal product={product} />
                </TouchableOpacity>
              )}
              style={{ padding: 15 }}
            />
          </View>
        ) : (
          <></>
        )
      }
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
      ListFooterComponent={() => (
        <>
          {branches.length > 0 && paginator?.next && (
            <RenderProductLoadingItems count={5} noPadding />
          )}
        </>
      )}
      style={style}
    />
  );
}

export function BranchesWithProductsFlatlistLoading() {
  return (
    <FlatList
      data={Array(5).fill(0)}
      keyExtractor={(_, i) => `branch-loading-${i}`}
      indicatorStyle="black"
      renderItem={() => (
        <View className="mb-5">
          <View className="px-5 py-3">
            <BranchProductItemLoading />
          </View>

          <FlatList
            horizontal
            data={Array(5).fill(0)}
            keyExtractor={(_, i) => `product-loading-${i}`}
            renderItem={() => (
              <View className="mr-5">
                <ProductLoadingItemHorizontal />
              </View>
            )}
            style={{ padding: 15 }}
          />
        </View>
      )}
      style={{ marginBottom: Platform.OS === 'ios' ? 80 : 0, paddingTop: 10 }}
    />
  );
}
