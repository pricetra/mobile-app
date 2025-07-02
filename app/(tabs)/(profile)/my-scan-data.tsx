import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback } from 'react';
import { View, Text } from 'react-native';

import AllProductBillingData from '@/components/profile/AllProductBillingData';
import TabHeaderItem from '@/components/ui/TabHeaderItem';

export default function MyScanDataScreen() {
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
                  <MaterialIcons name="data-object" size={20} color="#396a12" />
                </View>
                <Text className="font-bold" numberOfLines={1}>
                  My Scan Data
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

  return <AllProductBillingData />;
}
