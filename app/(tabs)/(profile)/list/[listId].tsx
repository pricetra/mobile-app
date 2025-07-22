import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';

import { ListIconRenderer } from '../index';

import BranchListView from '@/components/BranchListView';
import ProductListView from '@/components/ProductListView';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import TextRNR from '@/components/ui/Text';
import { useAuth } from '@/context/UserContext';
import { List, ListType } from '@/graphql/types/graphql';

export enum ListScreenTabType {
  Products = 'products',
  Branches = 'branches',
}

export default function ListScreen() {
  const navigation = useNavigation();
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

      return () => {
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [listId])
  );

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <View>
        <Tabs
          value={viewState}
          onValueChange={(s) => setViewState(s as ListScreenTabType)}
          className="mx-auto w-full max-w-[400px] flex-col gap-1.5">
          <View className="p-2 shadow-sm shadow-black/10">
            <TabsList className="w-full flex-row">
              <TabsTrigger value={ListScreenTabType.Products} className="flex-1">
                <TextRNR>Products</TextRNR>
              </TabsTrigger>
              <TabsTrigger value={ListScreenTabType.Branches} className="flex-1">
                <TextRNR>Branches</TextRNR>
              </TabsTrigger>
            </TabsList>
          </View>

          <TabsContent value={ListScreenTabType.Products}>
            <ProductListView listId={listId} />
          </TabsContent>
          <TabsContent value={ListScreenTabType.Branches}>
            <BranchListView listId={listId} />
          </TabsContent>
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
