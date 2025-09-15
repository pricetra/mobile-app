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
import { PartialCategory } from './ui/TabSubHeaderProductFilter';

import { SearchContext } from '@/context/SearchContext';
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
  categoryFilterInput?: PartialCategory;
};

export default function BranchesWithProductsFlatlist({
  branches,
  paginator,
  handleRefresh,
  setPage,
  style,
  categoryFilterInput,
}: BranchesWithProductsFlatlistProps) {
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const { search } = useContext(SearchContext);

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
                  className="mr-4"
                  onPress={() => {
                    router.push(`/(tabs)/(products)/${product.id}?stockId=${product.stock?.id}`);
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
                        params.append('searchQuery', encodeURIComponent(search));
                      }
                      if (categoryFilterInput) {
                        if (categoryFilterInput.id) {
                          params.append('categoryId', encodeURIComponent(categoryFilterInput.id));
                        }
                        if (
                          !categoryFilterInput.id &&
                          categoryFilterInput.name.toLowerCase() === 'all'
                        ) {
                          params.append('categoryId', 'undefined');
                        }
                      }
                      router.push(
                        `/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}?${params.toString()}`
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
