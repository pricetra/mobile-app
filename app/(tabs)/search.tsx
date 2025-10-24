import { useLazyQuery } from '@apollo/client';
import { FontAwesome6, Octicons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation, router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import TabHeaderContainer, { navConsts } from '@/components/ui/TabHeaderContainer';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import TabHeaderSearchBar from '@/components/ui/TabHeaderSearchBar';
import { MySearchHistoryDocument } from '@/graphql/types/graphql';

export default function SearchScreen() {
  const navigation = useNavigation();
  const { search } = useLocalSearchParams<{ search?: string }>();

  const iconStyles: StyleProp<ViewStyle> = {
    paddingVertical: navConsts.padding,
    paddingHorizontal: navConsts.padding + 5,
  };

  const [getSearchHistory, { data: searchHistoryData }] = useLazyQuery(MySearchHistoryDocument, {
    fetchPolicy: 'network-only',
    variables: { paginator: { page: 1, limit: 10 } },
  });

  useFocusEffect(
    useCallback(() => {
      getSearchHistory();
      navigation.setOptions({
        header: (_props: BottomTabHeaderProps) => (
          <TabHeaderContainer
            subHeader={
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex flex-row items-center justify-start gap-2 px-5 py-2">
                    <View className="mr-5 flex flex-row items-center justify-center gap-2 rounded-full bg-white px-2 py-2">
                      <Octicons name="history" size={15} color="black" />
                      <Text className="font-bold">History</Text>
                    </View>

                    {searchHistoryData?.mySearchHistory?.searches?.map(({ id, searchTerm }) => (
                      <TouchableOpacity
                        className="flex flex-row items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2"
                        key={`sh-${id}`}
                        onPress={() => router.setParams({ search: searchTerm })}>
                        <Text className="text-sm color-gray-500">{searchTerm}</Text>
                        <FontAwesome6 name="up-right-from-square" size={8} color="#6b7280" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </>
            }>
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
                router.push(`/(tabs)/?search=${t.trim()}`);
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
    }, [search, searchHistoryData])
  );

  return <></>;
}
