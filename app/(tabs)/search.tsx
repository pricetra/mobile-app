import { useLazyQuery } from '@apollo/client';
import { FontAwesome6 } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation, router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import {
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
import ProductItemHorizontal from '@/components/ProductItemHorizontal';
import TabHeaderContainer, { navConsts } from '@/components/ui/TabHeaderContainer';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import TabHeaderSearchBar from '@/components/ui/TabHeaderSearchBar';
import {
  MyProductViewHistoryDocument,
  MySearchHistoryDocument,
  Product,
} from '@/graphql/types/graphql';

export default function SearchScreen() {
  const navigation = useNavigation();
  const { search } = useLocalSearchParams<{ search?: string }>();

  const iconStyles: StyleProp<ViewStyle> = {
    paddingVertical: navConsts.padding,
    paddingHorizontal: navConsts.padding + 5,
  };

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

  useFocusEffect(
    useCallback(() => {
      getSearchHistory();
      getProductViewHistory();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        header: (_props: BottomTabHeaderProps) => (
          <TabHeaderContainer>
            <TabHeaderSearchBar
              onBackPressed={() => {
                router.push('/(tabs)/');
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
                router.push(`/(tabs)/?search=${encodeURIComponent(t.trim())}`);
              }}
              searchText={search}
            />
          </TabHeaderContainer>
        ),
      });

      return () => {
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [search])
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView keyboardShouldPersistTaps="always">
        <View className="mb-5">
          {productViewHistory && (
            <>
              <View className="p-5">
                <Text className="text-2xl font-bold">Recent viewed</Text>
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
                      router.push(`/(tabs)/(products)/${product.id}?stockId=${product.stock?.id}`, {
                        relativeToDirectory: false,
                      });
                    }}
                    style={{ width: HORIZONTAL_PRODUCT_WIDTH }}>
                    <ProductItemHorizontal
                      product={product as Product}
                      imgWidth={HORIZONTAL_PRODUCT_WIDTH}
                    />
                  </TouchableOpacity>
                )}
                style={{ padding: 15 }}
              />
            </>
          )}
        </View>

        <View className="mb-10">
          {searchHistoryData && (
            <>
              <View className="p-5">
                <Text className="text-2xl font-bold">Recent searches</Text>
              </View>

              {searchHistoryData?.mySearchHistory?.searches?.map(({ id, searchTerm }) => (
                <TouchableOpacity
                  className="my-1 flex flex-row items-center justify-between gap-2 px-5 py-3"
                  key={`sh-${id}`}
                  onPress={() => router.push(`/(tabs)/?search=${encodeURIComponent(searchTerm)}`)}>
                  <Text className="font-lg">{searchTerm}</Text>
                  <FontAwesome6 name="up-right-from-square" size={12} color="#6b7280" />
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
}
