import { QueryResult } from '@apollo/client';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
} from 'react-native';

import BranchProductItem, { BranchProductItemLoading } from './BranchProductItem';
import HorizontalShowMoreButton from './HorizontalShowMoreButton';
import ProductItemHorizontal, { ProductLoadingItemHorizontal } from './ProductItemHorizontal';
import StoreMini, { StoreMiniShowMore } from './StoreMini';
import LocationChangeButton from './ui/LocationChangeButton';
import { Skeleton } from './ui/Skeleton';
import { PartialCategory } from './ui/TabSubHeaderProductFilter';

import { SearchContext } from '@/context/SearchContext';
import {
  Branch,
  BranchesWithProductsQuery,
  Paginator,
  QueryBranchesWithProductsArgs,
  Store,
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
  categoryFilterInput?: PartialCategory;
  stores?: Store[];
  onLocationButtonPressed: () => void;
};

export default function BranchesWithProductsFlatlist({
  branches,
  paginator,
  handleRefresh,
  setPage,
  style,
  categoryFilterInput,
  stores,
  onLocationButtonPressed,
}: BranchesWithProductsFlatlistProps) {
  const [refreshing, setRefreshing] = useState(false);
  const { search } = useContext(SearchContext);

  return (
    <FlatList
      data={branches}
      keyExtractor={({ id }, i) => `${id}-${i}`}
      indicatorStyle="black"
      ListHeaderComponent={
        <>
          {!search && !categoryFilterInput?.id && stores && (
            <View className="mb-10 mt-5 flex flex-row flex-wrap items-center justify-center gap-2">
              {stores.map((store) => (
                <StoreMini key={`store-${store.id}`} store={store} />
              ))}
              <StoreMiniShowMore />
            </View>
          )}

          <View className="mb-8 mt-5 flex flex-row px-5">
            <LocationChangeButton onPress={onLocationButtonPressed} />

            <View className="flex-1" />
          </View>
        </>
      }
      renderItem={({ item: branch }) =>
        branch.products?.length ? (
          <View className="mb-5">
            <View className="px-5 py-3">
              <TouchableOpacity
                onPress={() => {
                  const params = new URLSearchParams();
                  params.append('categoryId', String(undefined));
                  params.append('page', String(1));
                  router.push(
                    `/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}?${params.toString()}`,
                    { relativeToDirectory: false }
                  );
                }}>
                <BranchProductItem branch={branch} />
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={branch.products}
              keyExtractor={({ id }, i) => `${id}-${i}`}
              renderItem={({ item: product }) => (
                <TouchableOpacity
                  className="mr-4"
                  onPress={() => {
                    router.push(`/(tabs)/(products)/${product.id}?stockId=${product.stock?.id}`, {
                      relativeToDirectory: false,
                    });
                  }}>
                  <ProductItemHorizontal product={product} />
                </TouchableOpacity>
              )}
              style={{ padding: 15 }}
              ListFooterComponent={() => (
                <HorizontalShowMoreButton
                  onPress={() => {
                    const params = new URLSearchParams();
                    if (search && search.length > 0) {
                      params.append('query', encodeURIComponent(search));
                    }
                    params.append('categoryId', categoryFilterInput?.id ?? String(undefined));
                    params.append('page', String(1));
                    router.push(
                      `/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}?${params.toString()}`,
                      { relativeToDirectory: false }
                    );
                  }}
                />
              )}
            />
          </View>
        ) : (
          <></>
        )
      }
      ListFooterComponent={paginator?.next ? <BranchWithProductsItemLoading /> : undefined}
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
        if (paginator?.next) {
          setPage(paginator.next);
        }
      }}
      onEndReachedThreshold={0.8}
      ListEmptyComponent={
        <View className="flex items-center justify-center px-5 py-36">
          <Text className="text-center">No products found</Text>
        </View>
      }
      style={style}
    />
  );
}

export function BranchWithProductsItemLoading() {
  return (
    <View className="mb-5">
      <View className="px-5 py-3">
        <BranchProductItemLoading />
      </View>

      <FlatList
        horizontal
        data={Array(5).fill(0)}
        keyExtractor={(_, i) => `product-loading-${i}`}
        renderItem={() => (
          <View className="mr-4">
            <ProductLoadingItemHorizontal />
          </View>
        )}
        style={{ padding: 15 }}
      />
    </View>
  );
}

export function BranchesWithProductsFlatlistLoading({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <FlatList
      data={Array(5).fill(0)}
      keyExtractor={(_, i) => `branch-loading-${i}`}
      indicatorStyle="black"
      ListHeaderComponent={
        <View className="mb-8 mt-5 flex flex-row px-5">
          <Skeleton className="h-14 w-60 rounded-full bg-gray-200" />
        </View>
      }
      renderItem={() => <BranchWithProductsItemLoading />}
      style={style}
    />
  );
}
