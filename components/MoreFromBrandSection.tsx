import { useLazyQuery } from '@apollo/client';
import { router } from 'expo-router';
import { Product, ProductSearchDocument } from 'graphql-utils';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { InView } from 'react-native-intersection-observer';

import { HORIZONTAL_PRODUCT_WIDTH } from './BranchesWithProductsFlatlist';
import HorizontalShowMoreButton from './HorizontalShowMoreButton';
import ProductItemHorizontal, { ProductLoadingItemHorizontal } from './ProductItemHorizontal';

export type MoreFromBrandProps = {
  brand: string;
};

export default function MoreFromBrand({ brand }: MoreFromBrandProps) {
  const [getBrandProducts, { data: brandProducts }] = useLazyQuery(ProductSearchDocument, {
    fetchPolicy: 'no-cache',
  });

  if (brand === '' || brand === 'N/A') return <></>;

  return (
    <InView
      triggerOnce
      onChange={(inView) => {
        if (!inView) return;
        getBrandProducts({
          variables: {
            paginator: { limit: 20, page: 1 },
            filters: { brand },
          },
        });
      }}>
      <View className="mb-16">
        <View className="mb-7 px-5">
          <Text className="text-lg">
            More from <Text className="font-bold">{brand}</Text>
          </Text>
        </View>

        {brandProducts ? (
          <FlatList
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            data={brandProducts.productSearch.products}
            keyExtractor={({ id }, i) => `${id}-${i}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push(`/(tabs)/(products)/${item.id}`, {
                    relativeToDirectory: false,
                  })
                }
                style={{
                  width: HORIZONTAL_PRODUCT_WIDTH,
                  marginRight: 16,
                }}>
                <ProductItemHorizontal
                  product={item as Product}
                  imgWidth={HORIZONTAL_PRODUCT_WIDTH}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            ListFooterComponent={() =>
              brandProducts.productSearch.paginator.next ? (
                <HorizontalShowMoreButton
                  onPress={() =>
                    router.push(`/(tabs)/?brand=${brand}`, {
                      relativeToDirectory: false,
                    })
                  }
                  heightDiv={1}
                  width={HORIZONTAL_PRODUCT_WIDTH}
                />
              ) : (
                <></>
              )
            }
          />
        ) : (
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
        )}
      </View>
    </InView>
  );
}
