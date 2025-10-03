import { useQuery } from '@apollo/client';
import { router } from 'expo-router';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';

import HorizontalShowMoreButton from './HorizontalShowMoreButton';
import ProductItemHorizontal from './ProductItemHorizontal';

import { AllProductsDocument, Branch, Product } from '@/graphql/types/graphql';

export type RelatedBranchProductsProps = {
  product: Product;
  branch: Branch;
  storeId: number;
};

export default function RelatedBranchProducts({
  product,
  branch,
  storeId,
}: RelatedBranchProductsProps) {
  const { data: relatedProducts } = useQuery(AllProductsDocument, {
    variables: {
      paginator: {
        limit: 10,
        page: 1,
      },
      search: {
        categoryId: product.categoryId,
        storeId,
        branchId: branch.id,
        sortByPrice: 'asc',
      },
    },
  });

  return (
    <View className="mt-5">
      <View className="mb-7 px-5">
        <Text className="text-lg font-semibold">Related in {branch.name}</Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={relatedProducts?.allProducts?.products}
        keyExtractor={({ id }, i) => `${id}-${i}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(`/(tabs)/(products)/${item.id}?stockID=${item.stock?.id}`, {
                relativeToDirectory: false,
              })
            }
            className="mr-4">
            <ProductItemHorizontal product={item as Product} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        ListFooterComponent={() =>
          relatedProducts?.allProducts?.paginator?.next ? (
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
