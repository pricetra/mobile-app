import { Feather } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { Platform, SafeAreaView, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import { useHeader } from '@/context/HeaderContext';
import { cn } from '@/lib/utils';

export type TabHeaderProductProps = BottomTabHeaderProps;

const iconSize = 20;
const logoHeight = 23;
const padding = 15;
const navHeight = 2 * padding + logoHeight;

const iconColor = '#333';

export default function TabHeaderProduct(props: TabHeaderProductProps) {
  const { rightNav } = useHeader();

  const iconStyles: StyleProp<ViewStyle> = {
    paddingVertical: padding,
    paddingHorizontal: padding + 5,
  };

  return (
    <SafeAreaView
      className={cn(
        'flex w-full bg-white',
        Platform.OS === 'android' ? 'shadow shadow-black/100' : 'border-b-[1px] border-neutral-100'
      )}>
      <View
        className="w-full flex-row items-center justify-between gap-3"
        style={{ marginTop: Platform.OS === 'android' ? 30 : 0, height: navHeight }}>
        <TouchableOpacity onPress={() => router.back()} style={iconStyles}>
          <Feather name="arrow-left" size={iconSize} color={iconColor} />
        </TouchableOpacity>

        <View className="flex flex-row items-center gap-2 px-3">{rightNav}</View>
      </View>
    </SafeAreaView>
  );
}
