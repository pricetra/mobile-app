import { useLazyQuery } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation, router, useLocalSearchParams } from 'expo-router';
import {
  MyProductViewHistoryDocument,
  MySearchHistoryDocument,
  PopularProductsDocument,
  PopularSearchKeywordsDocument,
  Product,
  SearchKeywordsDocument,
} from 'graphql-utils';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { HORIZONTAL_PRODUCT_WIDTH } from '@/components/BranchesWithProductsFlatlist';
import ProductItemHorizontal, {
  ProductLoadingItemHorizontal,
} from '@/components/ProductItemHorizontal';
import Btn from '@/components/ui/Btn';
import { Skeleton } from '@/components/ui/Skeleton';
import TabHeaderContainer, { navConsts } from '@/components/ui/TabHeaderContainer';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import TabHeaderSearchBar from '@/components/ui/TabHeaderSearchBar';
import { getNextWeekDateRange } from '@/lib/utils';

export type SearchRouteParams = {
  query?: string;
  categoryId?: string;
  category?: string;
  brand?: string;
  sale?: string;
  sortByPrice?: string;
};

export default function SearchScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<SearchRouteParams>();

  const iconStyles: StyleProp<ViewStyle> = {
    paddingVertical: navConsts.padding,
    paddingHorizontal: navConsts.padding + 5,
  };

  const [searchInputTyping, setSearchInputTyping] = useState(false);
  const [searchKeywords, { data: searchKeywordsData, loading: searchKeywordsLoading }] =
    useLazyQuery(SearchKeywordsDocument, {
      fetchPolicy: 'no-cache',
    });

  const [getSearchHistory, { data: searchHistoryData }] = useLazyQuery(MySearchHistoryDocument, {
    fetchPolicy: 'no-cache',
    variables: { paginator: { page: 1, limit: 10 } },
  });
  const [getProductViewHistory, { data: productViewHistory }] = useLazyQuery(
    MyProductViewHistoryDocument,
    {
      fetchPolicy: 'no-cache',
      variables: { paginator: { page: 1, limit: 10 } },
    }
  );

  const [getPopularSearchKeywords, { data: keywordsData }] = useLazyQuery(
    PopularSearchKeywordsDocument,
    { fetchPolicy: 'no-cache' }
  );
  const [getPopularProducts, { data: popularProductsData }] = useLazyQuery(
    PopularProductsDocument,
    { fetchPolicy: 'no-cache' }
  );

  useFocusEffect(
    useCallback(() => {
      getSearchHistory();
      getProductViewHistory();

      const nextWeekDateRange = getNextWeekDateRange();
      getPopularSearchKeywords({
        variables: {
          paginator: {
            page: 1,
            limit: 20,
          },
          dateRange: nextWeekDateRange,
        },
      });
      getPopularProducts({
        variables: {
          paginator: {
            page: 1,
            limit: 20,
          },
          dateRange: nextWeekDateRange,
        },
      });
    }, [])
  );

  function performSearch(search: string) {
    const sp = new URLSearchParams(params);
    sp.set('query', encodeURIComponent(search.trim()));
    router.push(`/(tabs)/?${sp.toString()}`);
  }

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        header: (_props: BottomTabHeaderProps) => (
          <TabHeaderContainer>
            <TabHeaderSearchBar
              onBackPressed={() => {
                router.back();
              }}
              logoHeight={navConsts.logoHeight}
              padding={navConsts.padding}
              iconStyles={iconStyles}
              iconColor={navConsts.iconColor}
              iconSize={navConsts.iconSize}
              updateSearch={(t) => {
                if (!t) {
                  router.setParams({});
                  return;
                }

                performSearch(t);
              }}
              onSearchTextChange={(t) => {
                const search = t.trim();
                if (search.length === 0) {
                  setSearchInputTyping(false);
                } else {
                  setSearchInputTyping(true);
                  searchKeywords({
                    variables: { search },
                  });
                }
              }}
              searchText={params.query}
            />
          </TabHeaderContainer>
        ),
      });

      return () => {
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [params.query])
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView keyboardShouldPersistTaps="always">
        {searchInputTyping ? (
          <View className="mt-5">
            {searchKeywordsLoading && (
              <View className="my-5 flex items-center justify-center">
                <ActivityIndicator />
              </View>
            )}

            {searchKeywordsData?.searchKeywords?.map((searchTerm, i) => (
              <TouchableOpacity
                className="my-1 flex flex-row items-center justify-between gap-2 px-5 py-3"
                key={`autocomplete-keyword-${i}-${searchTerm}`}
                onPress={() => performSearch(searchTerm)}>
                <Text className="font-lg">{searchTerm}</Text>
                <Ionicons name="search" size={15} color="#555" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <>
            <View className="mb-5">
              {productViewHistory && (
                <>
                  <View className="p-5">
                    <Text className="text-2xl font-bold">Recently viewed</Text>
                  </View>

                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={productViewHistory.myProductViewHistory.products}
                    keyExtractor={({ id }, i) => `${id}-${i}`}
                    renderItem={({ item: product }) => (
                      <TouchableOpacity
                        className="mr-4"
                        onPress={() => {
                          const urlParamBuilder = new URLSearchParams();
                          if (product.stock && product.stock.id !== 0) {
                            urlParamBuilder.append('stockId', String(product.stock.id));
                          }
                          router.push(
                            `/(tabs)/(products)/${product.id}?${urlParamBuilder.toString()}`,
                            {
                              relativeToDirectory: false,
                            }
                          );
                        }}
                        style={{ width: HORIZONTAL_PRODUCT_WIDTH }}>
                        <ProductItemHorizontal
                          product={product as Product}
                          imgWidth={HORIZONTAL_PRODUCT_WIDTH}
                          hideStoreInfo={false}
                        />
                      </TouchableOpacity>
                    )}
                    style={{ padding: 15 }}
                  />
                </>
              )}
            </View>

            <View className="border-b border-gray-200 pb-10">
              {searchHistoryData && (
                <>
                  <View className="p-5">
                    <Text className="text-2xl font-bold">Recent searches</Text>
                  </View>

                  {searchHistoryData?.mySearchHistory?.searches?.map(({ id, searchTerm }) => (
                    <TouchableOpacity
                      className="my-1 flex flex-row items-center justify-between gap-2 px-5 py-3"
                      key={`sh-${id}`}
                      onPress={() => performSearch(searchTerm)}>
                      <Text className="font-lg">{searchTerm}</Text>
                      <Ionicons name="search" size={15} color="#555" />
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </View>

            <View className="h-5" />

            <View className="mb-10">
              <View className="p-5">
                <Text className="text-2xl font-bold">Popular searches</Text>
              </View>

              <View className="flex flex-row flex-wrap items-center gap-2 px-5">
                {keywordsData ? (
                  <>
                    {keywordsData?.popularSearchKeywords?.searches?.map((keyword, i) => (
                      <Btn
                        key={`popular-sh-keyword-${i}-${keyword}`}
                        onPress={() => performSearch(keyword)}
                        text={keyword}
                        rounded="full"
                        className="border-[1px] border-gray-200 bg-gray-100"
                        color="color-black"
                        size="sm"
                        textWeight="normal"
                      />
                    ))}
                  </>
                ) : (
                  <>
                    {Array(20)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton
                          className="h-[34px] w-[80px] rounded-full"
                          key={`keyword-loading-${i}`}
                        />
                      ))}
                  </>
                )}
              </View>
            </View>

            <View className="mb-5">
              <View className="p-5">
                <Text className="text-2xl font-bold">Popular products</Text>
              </View>

              {popularProductsData ? (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={popularProductsData.popularProducts.products}
                  keyExtractor={({ id }, i) => `${id}-${i}`}
                  renderItem={({ item: product }) => (
                    <TouchableOpacity
                      className="mr-4"
                      onPress={() => {
                        const urlParamBuilder = new URLSearchParams();
                        if (product.stock && product.stock.id !== 0) {
                          urlParamBuilder.append('stockId', String(product.stock.id));
                        }
                        router.push(
                          `/(tabs)/(products)/${product.id}?${urlParamBuilder.toString()}`,
                          {
                            relativeToDirectory: false,
                          }
                        );
                      }}
                      style={{ width: HORIZONTAL_PRODUCT_WIDTH }}>
                      <ProductItemHorizontal
                        product={product as Product}
                        imgWidth={HORIZONTAL_PRODUCT_WIDTH}
                        hideStoreInfo={false}
                      />
                    </TouchableOpacity>
                  )}
                  style={{ padding: 15 }}
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
          </>
        )}

        <View className="h-[20vh]" />
      </ScrollView>

      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
}
