import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { List, ListType } from 'graphql-utils';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { ListIconRenderer } from '../index';

import BranchListView from '@/components/BranchListView';
import ProductListView from '@/components/ProductListView';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { useHeader } from '@/context/HeaderContext';
import { cn } from '@/lib/utils';
import ProductHistoryView from '@/components/ProductHistoryView';
import SearchHistoryView from '@/components/SearchHistoryView';

enum ListScreenTabType {
  Products = 'products',
  Searches = 'searches',
}

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { setSubHeader } = useHeader();
  const { tab } = useLocalSearchParams<{
    tab?: ListScreenTabType;
  }>();
  const [viewState, setViewState] = useState(ListScreenTabType.Products);

  useEffect(() => {
    if (!tab) return;
    setViewState(tab);
  }, [tab]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        header: (props: BottomTabHeaderProps) => (
          <TabHeaderItem
            {...props}
            leftNav={
              <View className="flex flex-row items-center gap-3">
                <View className="flex size-[35px] items-center justify-center rounded-full bg-gray-100">
                  {ListIconRenderer('history')}
                </View>
                <Text className="font-bold" numberOfLines={1}>
                  History
                </Text>
              </View>
            }
          />
        ),
      });

      setSubHeader(
        <View className="flex flex-row items-center justify-center px-5 py-3">
          <TouchableOpacity
            onPress={() => setViewState(ListScreenTabType.Products)}
            className={cn(
              'rounded-lg px-7 py-2',
              viewState === ListScreenTabType.Products ? 'bg-gray-100' : 'bg-white'
            )}>
            <Text>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewState(ListScreenTabType.Searches)}
            className={cn(
              'rounded-lg px-7 py-2',
              viewState === ListScreenTabType.Searches ? 'bg-gray-100' : 'bg-white'
            )}>
            <Text>Search History</Text>
          </TouchableOpacity>
        </View>
      );

      return () => {
        setSubHeader(undefined);
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [viewState])
  );

  return (
    <ScrollView>
      {viewState === ListScreenTabType.Products && <ProductHistoryView />}
      {viewState === ListScreenTabType.Searches && <SearchHistoryView />}
    </ScrollView>
  );
}