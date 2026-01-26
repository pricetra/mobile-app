import { QueryResult } from '@apollo/client';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import {
  Branch,
  BranchesWithProductsQuery,
  Paginator,
  QueryBranchesWithProductsArgs,
  Store,
} from 'graphql-utils';
import { useMemo, useState } from 'react';
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
import { FlatGrid } from 'react-native-super-grid';

import BranchProductItem, { BranchProductItemLoading } from './BranchProductItem';
import HorizontalShowMoreButton from './HorizontalShowMoreButton';
import MyBranchPanel from './MyBranchPanel';
import ProductItemHorizontal, { ProductLoadingItemHorizontal } from './ProductItemHorizontal';
import StoreMini, { StoreMiniLoading, StoreMiniShowMore } from './StoreMini';

import { SearchRouteParams } from '@/app/(tabs)/search';
import useStoreUser from '@/hooks/useStoreUser';

export type BranchesWithProductsFlatlistProps = {
  branches?: Branch[];
  paginator?: Paginator;
  handleRefresh: () => Promise<void | QueryResult<
    BranchesWithProductsQuery,
    QueryBranchesWithProductsArgs
  >>;
  setPage: (page: number) => void;
  style?: StyleProp<ViewStyle>;
  stores?: Store[];
  loading: boolean;
  resetting?: boolean;
};

export default function BranchesWithProductsFlatlist({
  branches,
  paginator,
  handleRefresh,
  setPage,
  style,
  stores,
  loading,
  resetting,
}: BranchesWithProductsFlatlistProps) {
  const myStoreUserBranches = useStoreUser();
  const [refreshing, setRefreshing] = useState(false);
  const params = useLocalSearchParams<SearchRouteParams>();
  const paramsBuilder = useMemo(() => new URLSearchParams(params), [params]);
  const paramsString = useMemo(() => paramsBuilder.toString(), [paramsBuilder]);

  return (
    <FlatList
      data={resetting ? [] : branches}
      keyExtractor={({ id }, i) => `${id}-${i}`}
      indicatorStyle="black"
      ListHeaderComponent={
        <>
          {(paramsString === '' || paramsString === 'query=') && (
            <>
              {stores ? (
                <FlatGrid
                  data={[...stores, { id: 0 } as Store]}
                  itemDimension={50}
                  spacing={15}
                  keyExtractor={({ id }) => `store-${id}`}
                  renderItem={({ item }) =>
                    item.id !== 0 ? <StoreMini store={item} /> : <StoreMiniShowMore />
                  }
                  style={{ marginBottom: 15 }}
                />
              ) : (
                <FlatGrid
                  data={Array(10)
                    .fill(0)
                    .map((_, i) => i)}
                  itemDimension={50}
                  spacing={15}
                  keyExtractor={(i) => `store-loading-${i}`}
                  renderItem={() => <StoreMiniLoading />}
                  style={{ marginBottom: 15 }}
                />
              )}

              {myStoreUserBranches && myStoreUserBranches.length > 0 && (
                <MyBranchPanel myStoreUserBranches={myStoreUserBranches} />
              )}
            </>
          )}
        </>
      }
      renderItem={({ item: branch }) => (
        <BranchWithProductItem
          branch={branch}
          onPressBranch={() => {
            const paramsBuilder = new URLSearchParams();
            paramsBuilder.append('page', String(1));
            router.push(
              `/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}?${paramsBuilder.toString()}`,
              { relativeToDirectory: false }
            );
          }}
          onPressShowMore={() => {
            const paramsBuilder = new URLSearchParams(params);
            paramsBuilder.append('page', String(1));
            router.push(
              `/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}?${paramsBuilder.toString()}`,
              { relativeToDirectory: false }
            );
          }}
        />
      )}
      ListFooterComponent={
        <View className="mb-20">
          {(branches?.length ?? 0) > 0 && paginator?.next && <BranchWithProductsItemLoading />}
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
      onEndReached={() => {
        if (paginator?.next) {
          setPage(paginator.next);
        }
      }}
      onEndReachedThreshold={0.5}
      nestedScrollEnabled
      ListEmptyComponent={
        <>
          {paginator && paginator.total === 0 ? (
            <View className="px-5 py-10">
              <Text className="text-center color-gray-500">No results found</Text>
            </View>
          ) : (
            <>
              {(resetting || !branches) && (
                <>
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <BranchWithProductsItemLoading key={`branch-products-loading-${i}`} />
                    ))}
                </>
              )}
            </>
          )}
        </>
      }
      style={style}
    />
  );
}

export const HORIZONTAL_PRODUCT_WIDTH = 130;

export function BranchWithProductsItemLoading() {
  return (
    <View className="mb-5">
      <View className="px-5 py-3">
        <BranchProductItemLoading />
      </View>

      <FlatList
        horizontal
        data={Array(10).fill(0)}
        keyExtractor={(_, i) => `product-loading-${i}`}
        renderItem={() => (
          <View className="mr-4" style={{ width: HORIZONTAL_PRODUCT_WIDTH }}>
            <ProductLoadingItemHorizontal imgWidth={HORIZONTAL_PRODUCT_WIDTH} />
          </View>
        )}
        style={{ padding: 15 }}
      />
    </View>
  );
}

export function BranchWithProductItem({
  branch,
  onPressBranch,
  onPressShowMore,
}: {
  branch: Branch;
  onPressBranch: () => void;
  onPressShowMore: () => void;
}) {
  return (
    <View className="mb-5">
      <View className="px-5 py-3">
        <TouchableOpacity onPress={onPressBranch}>
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
            }}
            style={{ width: HORIZONTAL_PRODUCT_WIDTH }}>
            <ProductItemHorizontal product={product} imgWidth={HORIZONTAL_PRODUCT_WIDTH} />
          </TouchableOpacity>
        )}
        style={{ padding: 15 }}
        ListFooterComponent={() => (
          <HorizontalShowMoreButton onPress={onPressShowMore} heightDiv={1} />
        )}
      />
    </View>
  );
}

export function BranchesWithProductsFlatlistLoading({
  style,
  itemCount = 5,
  showStores = false,
}: {
  style?: StyleProp<ViewStyle>;
  itemCount?: number;
  showStores?: boolean;
}) {
  const params = useLocalSearchParams<SearchRouteParams>();

  return (
    <FlatList
      data={Array(itemCount).fill(0)}
      keyExtractor={(_, i) => `branch-loading-${i}`}
      indicatorStyle="black"
      ListHeaderComponent={
        <>
          {showStores && !params.query && !params.categoryId && !params.brand && (
            <FlatGrid
              data={Array(10)
                .fill(0)
                .map((_, i) => i)}
              itemDimension={50}
              spacing={15}
              keyExtractor={(i) => `store-loading-${i}`}
              renderItem={() => <StoreMiniLoading />}
              style={{ marginBottom: 15 }}
            />
          )}
        </>
      }
      renderItem={() => <BranchWithProductsItemLoading />}
      style={style}
    />
  );
}
