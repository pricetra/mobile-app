import { useQuery } from '@apollo/client';
import { router } from 'expo-router';
import { FlatList, TouchableOpacity, View } from 'react-native';

import BranchProductItem from './BranchProductItem';
import {
  BranchWithProductsItemLoading,
  HORIZONTAL_PRODUCT_WIDTH,
} from './BranchesWithProductsFlatlist';
import HorizontalShowMoreButton from './HorizontalShowMoreButton';
import ProductItemHorizontal from './ProductItemHorizontal';

import { AllProductsDocument, Branch, Product } from '@/graphql/types/graphql';

export type RelatedBranchProductsProps = {
  product: Product;
  branch: Branch;
  storeId: number;
  hideDuringLoading?: boolean;
  disableCurrentProduct?: boolean;
};

export default function RelatedBranchProducts({
  product,
  branch,
  storeId,
  hideDuringLoading = false,
  disableCurrentProduct = false,
}: RelatedBranchProductsProps) {
  const { data, loading } = useQuery(AllProductsDocument, {
    fetchPolicy: 'no-cache',
    variables: {
      paginator: {
        limit: 10,
        page: 1,
      },
      search: {
        category: product.category?.name,
        storeId,
        branchId: branch.id,
        sortByPrice: 'asc',
      },
    },
  });

  if (hideDuringLoading && loading) return <></>;

  if (loading) return <BranchWithProductsItemLoading />;

  if (data?.allProducts?.paginator && data.allProducts.paginator.total === 0) return <></>;

  return (
    <View className="mt-10">
      <View className="mb-7 px-5">
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/(stores)/${storeId}/branch/${branch.id}`)}>
          <BranchProductItem branch={branch} branchTagline="Similar products in" />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data?.allProducts?.products}
        keyExtractor={({ id }, i) => `${id}-${i}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(`/(tabs)/(products)/${item.id}?stockId=${item.stock?.id}`, {
                relativeToDirectory: false,
              })
            }
            disabled={disableCurrentProduct && item.id === product.id}
            style={{
              width: HORIZONTAL_PRODUCT_WIDTH,
              marginRight: 16,
              opacity: disableCurrentProduct && item.id === product.id ? 0.5 : 1,
            }}>
            <ProductItemHorizontal product={item as Product} imgWidth={HORIZONTAL_PRODUCT_WIDTH} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        ListFooterComponent={() =>
          data?.allProducts?.paginator?.next ? (
            <HorizontalShowMoreButton
              onPress={() =>
                router.push(`/(tabs)/(stores)/${storeId}/branch/${branch.id}`, {
                  relativeToDirectory: false,
                })
              }
              heightDiv={3}
            />
          ) : undefined
        }
      />
    </View>
  );
}
