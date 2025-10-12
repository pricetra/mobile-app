import { Entypo, FontAwesome6 } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback } from 'react';
import { View, Text, KeyboardAvoidingView, FlatList } from 'react-native';

import FloatingActionButton from '@/components/ui/FloatingActionButton';
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
    <View style={{ flex: 1 }}>
      <FloatingActionButton btnClassName="gap-5 px-12 bg-gray-800" onPress={() => {}}>
        <Entypo name="add-to-list" size={30} color="white" />
        <Text className="text-xl font-bold color-white">Add</Text>
      </FloatingActionButton>
    </View>
  );
}
