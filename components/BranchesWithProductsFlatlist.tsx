import { QueryResult } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
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
  useWindowDimensions,
} from 'react-native';

import BranchProductItem, { BranchProductItemLoading } from './BranchProductItem';
import ProductItemHorizontal, { ProductLoadingItemHorizontal } from './ProductItemHorizontal';
import StoreMini, { StoreMiniShowMore } from './StoreMini';
import PaginationSimple from './ui/PaginationSimple';
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
};

export default function BranchesWithProductsFlatlist({
  branches,
  paginator,
  handleRefresh,
  setPage,
  style,
  categoryFilterInput,
  stores,
}: BranchesWithProductsFlatlistProps) {
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const { search } = useContext(SearchContext);

  return (
    <FlatList
      data={branches}
      keyExtractor={({ id }, i) => `${id}-${i}`}
      indicatorStyle="black"
      ListHeaderComponent={
        !search && paginator?.page === 1 && !categoryFilterInput?.id && stores ? (
          <View className="mb-14 mt-5 flex flex-row flex-wrap items-center justify-center gap-2">
            {stores.slice(0, 9).map((store) => (
              <StoreMini key={`store-${store.id}`} store={store} />
            ))}
            <StoreMiniShowMore />
          </View>
        ) : (
          <></>
        )
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
                <View
                  className="mx-5 flex flex-col items-start justify-center"
                  style={{ width: width / 3, height: width / 2 }}>
                  <TouchableOpacity
                    className="flex size-24 flex-col items-center justify-center gap-1 rounded-xl border-[1px] border-gray-200 bg-gray-50"
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
                    }}>
                    <AntDesign name="arrowright" size={25} color="#4b5563" />
                    <Text className="text-xs color-gray-600">Show All</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        ) : (
          <></>
        )
      }
      ListFooterComponent={
        <View className="px-5">
          {paginator && (paginator.next || paginator.prev) && (
            <PaginationSimple paginator={paginator} onPageChange={setPage} />
          )}

          <View className="h-[100px]" />
        </View>
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
              <View className="mr-4">
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
