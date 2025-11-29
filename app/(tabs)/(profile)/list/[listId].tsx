import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { ListIconRenderer } from '../index';

import BranchListView from '@/components/BranchListView';
import ProductListView from '@/components/ProductListView';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { useHeader } from '@/context/HeaderContext';
import { useAuth } from '@/context/UserContext';
import { List, ListType } from 'graphql-utils';
import { cn } from '@/lib/utils';

export enum ListScreenTabType {
  Products = 'products',
  Branches = 'branches',
}

export default function ListScreen() {
  const navigation = useNavigation();
  const { setSubHeader } = useHeader();
  const { lists } = useAuth();
  const { listId, tab } = useLocalSearchParams<{
    listId: string;
    type?: ListType;
    tab?: ListScreenTabType;
  }>();
  const [, setList] = useState<List>();
  const [viewState, setViewState] = useState(ListScreenTabType.Products);

  useEffect(() => {
    if (!tab) return;
    setViewState(tab);
  }, [tab]);

  useFocusEffect(
    useCallback(() => {
      const list = lists.allLists.find(({ id }) => id.toString() === listId);
      if (!list) {
        navigation.goBack();
        return;
      }
      setList(list);
      navigation.setOptions({
        header: (props: BottomTabHeaderProps) => (
          <TabHeaderItem
            {...props}
            leftNav={
              <View className="flex flex-row items-center gap-3">
                <View className="flex size-[35px] items-center justify-center rounded-full bg-gray-100">
                  {ListIconRenderer(list.type)}
                </View>
                <Text className="font-bold" numberOfLines={1}>
                  {list.name}
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
            onPress={() => setViewState(ListScreenTabType.Branches)}
            className={cn(
              'rounded-lg px-7 py-2',
              viewState === ListScreenTabType.Branches ? 'bg-gray-100' : 'bg-white'
            )}>
            <Text>Branches</Text>
          </TouchableOpacity>
        </View>
      );

      return () => {
        setSubHeader(undefined);
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [listId, viewState])
  );

  return (
    <ScrollView>
      {viewState === ListScreenTabType.Products && <ProductListView listId={listId} />}
      {viewState === ListScreenTabType.Branches && <BranchListView listId={listId} />}
    </ScrollView>
  );
}
