import { FontAwesome6 } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback } from 'react';
import { View, Text } from 'react-native';

import TabHeaderItem from '@/components/ui/TabHeaderItem';

export default function GroceryList() {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        header: (props: BottomTabHeaderProps) => (
          <TabHeaderItem
            {...props}
            leftNav={
              <View className="flex flex-row items-center gap-3">
                <View className="flex size-[35px] items-center justify-center rounded-full bg-pricetraGreenHeavyDark/10">
                  <FontAwesome6 name="list-check" size={15} color="#396a12" />
                </View>
                <Text className="font-bold" numberOfLines={1}>
                  Grocery List
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

  return (
    <View className="mt-28 items-center justify-center">
      <Text className="text-lg font-bold">Grocery List</Text>
      <Text className="text-gray-500">This is your grocery list.</Text>
    </View>
  );
}
