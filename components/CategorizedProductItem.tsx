import { router } from 'expo-router';
import { CategoryWithProducts, Product } from 'graphql-utils';
import { TouchableOpacity, View, Text, FlatList } from 'react-native';

import { HORIZONTAL_PRODUCT_WIDTH } from './BranchesWithProductsFlatlist';
import { Skeleton } from './ui/Skeleton';

import HorizontalShowMoreButton from '@/components/HorizontalShowMoreButton';
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from '@/components/ProductItemHorizontal';

export type CategorizedProductItemProps = {
  category: CategoryWithProducts;
  storeId: number;
  branchId: number;
};

export default function CategorizedProductItem({
  category,
  storeId,
  branchId,
}: CategorizedProductItemProps) {
  return (
    <View className="mb-14">
      <View className="mb-7 px-5">
        <TouchableOpacity
          onPress={() =>
            router.push(
              `/(tabs)/(stores)/${storeId}/branch/${branchId}?category=${category.name}&categoryId=${category.id}`
            )
          }>
          <Text className="text-2xl font-bold">{category.name}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        data={category.products}
        keyExtractor={({ id }, i) => `${id}-${i}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(`/(tabs)/(products)/${item.id}?stockId=${item.stock?.id}`, {
                relativeToDirectory: false,
              })
            }
            style={{
              width: HORIZONTAL_PRODUCT_WIDTH,
              marginRight: 16,
            }}>
            <ProductItemHorizontal product={item as Product} imgWidth={HORIZONTAL_PRODUCT_WIDTH} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        ListFooterComponent={() =>
          category.products.length > 10 ? (
            <HorizontalShowMoreButton
              onPress={() =>
                router.push(`/(tabs)/(stores)/${storeId}/branch/${branchId}?category=${category}`, {
                  relativeToDirectory: false,
                })
              }
              heightDiv={1}
              width={HORIZONTAL_PRODUCT_WIDTH}
            />
          ) : undefined
        }
      />
    </View>
  );
}

export function CategorizedProductItemLoading() {
  return (
    <View className="mb-14">
      <View className="mb-7 px-5">
        <Skeleton className="h-6 w-28 rounded-md" />
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
