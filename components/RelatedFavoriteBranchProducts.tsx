import { useQuery } from '@apollo/client';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import {
  BranchesWithProductsFlatlistLoading,
  BranchWithProductItem,
} from './BranchesWithProductsFlatlist';

import { useAuth } from '@/context/UserContext';
import { Branch, BranchesWithProductsDocument, Product } from '@/graphql/types/graphql';

export type RelatedFavoriteBranchProductsProps = {
  product: Product;
  branchId?: number;
};

export default function RelatedFavoriteBranchProducts({
  product,
  branchId,
}: RelatedFavoriteBranchProductsProps) {
  const { lists } = useAuth();
  const favBranchIds = useMemo(
    () =>
      (lists.favorites.branchList ?? [])
        .map(({ branchId }) => branchId)
        .filter((id) => id !== branchId),
    [lists.favorites.branchList]
  );
  const { data, loading } = useQuery(BranchesWithProductsDocument, {
    variables: {
      paginator: {
        limit: 10,
        page: 1,
      },
      productLimit: 10,
      filters: {
        categoryId: product.categoryId,
        branchIds: favBranchIds,
        sortByPrice: 'asc',
      },
    },
    fetchPolicy: 'no-cache',
  });
  const filteredData = useMemo(
    () =>
      (data?.branchesWithProducts?.branches?.filter(
        ({ products }) => products && products.length > 0
      ) ?? []) as Branch[],
    [data?.branchesWithProducts?.branches]
  );

  if (loading)
    return (
      <BranchesWithProductsFlatlistLoading
        showLocationButton={false}
        itemCount={favBranchIds.length}
      />
    );

  if (!data?.branchesWithProducts) return <></>;

  return filteredData.map((branch, idx) => (
    <View key={`related-${branch.id}-${idx}`}>
      <BranchWithProductItem
        branch={branch}
        onPressBranch={() => {
          router.push(`/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}`, {
            relativeToDirectory: false,
          });
        }}
        onPressShowMore={() => {
          router.push(
            `/(tabs)/(stores)/${branch.storeId}/branch/${branch.id}?categoryId=${product.categoryId}`,
            {
              relativeToDirectory: false,
            }
          );
        }}
      />
    </View>
  ));
}
