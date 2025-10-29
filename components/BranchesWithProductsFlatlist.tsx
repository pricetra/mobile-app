import { QueryResult } from '@apollo/client';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useState } from 'react';
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
import ProductItemHorizontal, { ProductLoadingItemHorizontal } from './ProductItemHorizontal';
import StoreMini, { StoreMiniLoading, StoreMiniShowMore } from './StoreMini';
import LocationChangeButton from './ui/LocationChangeButton';
import SearchFilters from './ui/SearchFilters';
import { Skeleton } from './ui/Skeleton';

import { SearchRouteParams } from '@/app/(tabs)/search';
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
  stores?: Store[];
  onLocationButtonPressed: () => void;
  loading: boolean;
  showLocationButton?: boolean;
};

export default function BranchesWithProductsFlatlist({
  branches,
  paginator,
  handleRefresh,
  setPage,
  style,
  stores,
  onLocationButtonPressed,
  loading,
  showLocationButton = true,
}: BranchesWithProductsFlatlistProps) {
  const [refreshing, setRefreshing] = useState(false);
  const params = useLocalSearchParams<SearchRouteParams>();

  return (
    <FlatList
      data={branches}
      keyExtractor={({ id }, i) => `${id}-${i}`}
      indicatorStyle="black"
      ListHeaderComponent={
        <>
          {!params.query && !params.categoryId && stores && (
            <FlatGrid
              data={[...stores, { id: 0 } as Store]}
              itemDimension={50}
              spacing={15}
              keyExtractor={({ id }) => `store-${id}`}
              renderItem={({ item }) =>
                item.id !== 0 ? <StoreMini store={item} /> : <StoreMiniShowMore />
              }
            />
          )}

          <View className="col mb-8 mt-5 flex flex-col gap-3 px-5">
            {showLocationButton && (
              <View className="flex flex-row">
                <LocationChangeButton onPress={onLocationButtonPressed} />

                <View className="flex-1" />
              </View>
            )}

            <SearchFilters
              params={params}
              onUpdateParams={(p) =>
                router.replace(`/?${p.toString()}`, { relativeToDirectory: true })
              }
            />
          </View>
        </>
      }
      renderItem={({ item: branch }) => (
        <BranchWithProductItem
          branch={branch}
          onPressBranch={() => {
            const paramsBuilder = new URLSearchParams();
            paramsBuilder.append('categoryId', String(undefined));
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
          {branches.length > 0 && paginator?.next && <BranchWithProductsItemLoading />}
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
        !loading ? (
          <View className="px-5 py-10">
            <Text className="text-center color-gray-500">No results found</Text>
          </View>
        ) : undefined
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
        data={Array(5).fill(0)}
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
  showLocationButton = true,
  itemCount = 5,
  showBranches = false,
}: {
  style?: StyleProp<ViewStyle>;
  showLocationButton?: boolean;
  itemCount?: number;
  showBranches?: boolean;
}) {
  return (
    <FlatList
      data={Array(itemCount).fill(0)}
      keyExtractor={(_, i) => `branch-loading-${i}`}
      indicatorStyle="black"
      ListHeaderComponent={
        <>
          {showBranches && (
            <FlatGrid
              data={Array(10)
                .fill(0)
                .map((_, i) => i)}
              itemDimension={50}
              spacing={15}
              keyExtractor={(i) => `store-loading-${i}`}
              renderItem={() => <StoreMiniLoading />}
            />
          )}

          {showLocationButton ? (
            <View className="mb-8 mt-5 flex flex-row px-5">
              <Skeleton className="h-10 w-52 rounded-full bg-gray-200" />
            </View>
          ) : undefined}
        </>
      }
      renderItem={() => <BranchWithProductsItemLoading />}
      style={style}
    />
  );
}
