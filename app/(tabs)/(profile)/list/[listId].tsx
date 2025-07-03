import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';

import { ListIconRenderer } from '../index';

import ProductListView from '@/components/ProductListView';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import TextRNR from '@/components/ui/Text';
import { useAuth } from '@/context/UserContext';
import { List, ListType } from '@/graphql/types/graphql';

export enum ListScreenViewType {
  Products = 'Products',
  Branches = 'Branches',
}

export default function ListScreen() {
  const navigation = useNavigation();
  const { lists } = useAuth();
  const { listId } = useLocalSearchParams<{ listId: string; type?: ListType }>();
  const [list, setList] = useState<List>();
  const [viewState, setViewState] = useState(ListScreenViewType.Products);

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
    }, [listId])
  );

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <View>
        <Tabs
          value={viewState}
          onValueChange={(s) => setViewState(s as ListScreenViewType)}
          className="mx-auto w-full max-w-[400px] flex-col gap-1.5">
          <View className="p-2 shadow-sm shadow-black/10">
            <TabsList className="w-full flex-row">
              <TabsTrigger value={ListScreenViewType.Products} className="flex-1">
                <TextRNR>Products</TextRNR>
              </TabsTrigger>
              <TabsTrigger value={ListScreenViewType.Branches} className="flex-1">
                <TextRNR>Branches</TextRNR>
              </TabsTrigger>
            </TabsList>
          </View>

          <TabsContent value={ListScreenViewType.Products}>
            <ProductListView listId={listId} />
          </TabsContent>
          <TabsContent value={ListScreenViewType.Branches}>
            <Text>My Branches</Text>
          </TabsContent>
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
