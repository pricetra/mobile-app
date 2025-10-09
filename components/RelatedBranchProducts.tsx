import { useQuery } from '@apollo/client';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

import BranchProductItem from './BranchProductItem';
import {
  BranchesWithProductsFlatlistLoading,
  HORIZONTAL_PRODUCT_WIDTH,
} from './BranchesWithProductsFlatlist';
import HorizontalShowMoreButton from './HorizontalShowMoreButton';
import ProductItemHorizontal from './ProductItemHorizontal';

import { useAuth } from '@/context/UserContext';
import { Branch, BranchesWithProductsDocument, Product, Stock } from '@/graphql/types/graphql';

export type RelatedBranchProductsProps = {
  product: Product;
  stock?: Stock;
  hideDuringLoading?: boolean;
};

export default function RelatedBranchProducts({
  product,
  stock,
  hideDuringLoading = false,
}: RelatedBranchProductsProps) {
  const { lists } = useAuth();
  const favoriteBranchIds = useMemo(
    () =>
      (lists.favorites.branchList ?? [])
        .map(({ branchId }) => branchId)
        .filter((id) => id !== stock?.branchId),
    [lists.favorites.branchList, stock]
  );
  const category = product.category?.name;
  const sortByPrice = 'asc';
  const { data, loading } = useQuery(BranchesWithProductsDocument, {
    fetchPolicy: 'no-cache',
    variables: {
      paginator: {
        limit: favoriteBranchIds.length + (stock ? 1 : 0),
        page: 1,
      },
      productLimit: 10,
      filters: {
        category,
        sortByPrice,
        branchIds: stock ? [stock.branchId, ...favoriteBranchIds] : favoriteBranchIds,
      },
    },
  });

  if (hideDuringLoading && loading) return <></>;

  if (loading) return <BranchesWithProductsFlatlistLoading showLocationButton={false} />;

  if (!data || data.branchesWithProducts.paginator.total === 0) return <></>;

  return (
    <>
      {data.branchesWithProducts.branches
        .filter((b) => b.products?.length !== 0)
        .map((branch) => (
          <View key={`branch-${branch.id}`} className="mb-14">
            <View className="mb-7 px-5">
              <TouchableOpacity
                onPress={() =>
                  router.push(`/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}`)
                }>
                <BranchProductItem branch={branch as Branch} branchTagline="Similar products in" />
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              data={branch.products}
              keyExtractor={({ id }, i) => `${id}-${i}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/(tabs)/(products)/${item.id}?stockId=${item.stock?.id}`, {
                      relativeToDirectory: false,
                    })
                  }
                  disabled={item.id === product.id && item.stock?.id === stock?.id}
                  style={{
                    width: HORIZONTAL_PRODUCT_WIDTH,
                    marginRight: 16,
                    opacity: item.id === product.id && item.stock?.id === stock?.id ? 0.5 : 1,
                  }}>
                  <ProductItemHorizontal
                    product={item as Product}
                    imgWidth={HORIZONTAL_PRODUCT_WIDTH}
                  />
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              ListFooterComponent={() =>
                (branch.products?.length ?? 0) > 0 ? (
                  <HorizontalShowMoreButton
                    onPress={() =>
                      router.push(
                        `/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}?category=${category}&sortByPrice=${sortByPrice}`,
                        {
                          relativeToDirectory: false,
                        }
                      )
                    }
                    heightDiv={1}
                    width={HORIZONTAL_PRODUCT_WIDTH}
                  />
                ) : undefined
              }
            />
          </View>
        ))}
    </>
  );
}
