import { useLazyQuery } from '@apollo/client';
import { FontAwesome5 } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, RefreshControl, Platform, KeyboardAvoidingView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import GroceryListItem, {
  GroceryListItemDeleteAction,
} from '@/components/grocery-list/GroceryListItem';
import GroceryListItemCreate from '@/components/grocery-list/GroceryListItemCreate';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { useAuth } from '@/context/UserContext';
import {
  GroceryListItem as GqlGroceryListItem,
  GroceryListItemsDocument,
} from '@/graphql/types/graphql';

export default function GroceryList() {
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const { allGroceryLists } = useAuth();
  const [selectedGroceryList] = useState(allGroceryLists?.defaultGroceryList);
  const [getGroceryListItems, { data: groceryListItemsData, loading: groceryListItemsLoading }] =
    useLazyQuery(GroceryListItemsDocument, {
      fetchPolicy: 'network-only',
    });

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        header: (props: BottomTabHeaderProps) => (
          <TabHeaderItem
            {...props}
            leftNav={
              <View className="flex flex-row items-center gap-3">
                <View className="flex size-[35px] items-center justify-center rounded-full bg-pricetraGreenHeavyDark/10">
                  <FontAwesome5 name="shopping-basket" size={15} color="#396a12" />
                </View>
                <Text className="font-bold" numberOfLines={1}>
                  My Shopping List
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
    }, [])
  );

  useEffect(() => {
    if (!flatListRef.current) return;
    if (!selectedGroceryList) return;

    getGroceryListItems({
      variables: {
        groceryListId: selectedGroceryList.id,
        filters: { sortByCreation: 'asc' },
      },
    });
  }, [selectedGroceryList, flatListRef.current]);

  useEffect(() => {
    if (!groceryListItemsData?.groceryListItems) return;
    if (groceryListItemsData.groceryListItems.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 0);
    }
  }, [groceryListItemsData?.groceryListItems]);

  if (!selectedGroceryList) return <></>;

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={flatListRef}
          ListHeaderComponent={
            <View className="mb-2 px-5 py-5">
              <Text className="text-3xl font-extrabold">{selectedGroceryList.name}</Text>
            </View>
          }
          data={groceryListItemsData?.groceryListItems}
          keyExtractor={({ id }, i) => `grocery-list-item-${id}-${i}`}
          renderItem={({ item }) => (
            <GestureHandlerRootView>
              <Swipeable
                containerStyle={{ backgroundColor: '#b91c1c' }}
                friction={2}
                rightThreshold={40}
                renderRightActions={(prog, drag) =>
                  GroceryListItemDeleteAction({ groceryListItemId: item.id }, prog, drag)
                }>
                <GroceryListItem item={item as GqlGroceryListItem} />
              </Swipeable>
            </GestureHandlerRootView>
          )}
          refreshControl={
            <RefreshControl
              refreshing={groceryListItemsLoading}
              onRefresh={async () => {
                await getGroceryListItems({ variables: { groceryListId: selectedGroceryList.id } });
              }}
              colors={Platform.OS === 'ios' ? ['black'] : ['white']}
              progressBackgroundColor="#111827"
            />
          }
          ListFooterComponent={
            <>
              <View>
                <GroceryListItemCreate groceryListId={selectedGroceryList.id} />
              </View>

              <View style={{ height: 200 }} />
            </>
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
}
