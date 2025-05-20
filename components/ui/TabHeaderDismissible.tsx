import { Feather } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import {
  Platform,
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Text,
} from 'react-native';

import { cn } from '@/lib/utils';

export type TabHeaderDismissibleProps = BottomTabHeaderProps;

const iconSize = 20;
const logoHeight = 23;
const padding = 15;
const navHeight = 2 * padding + logoHeight;

const iconColor = '#333';

export default function TabHeaderDismissible(props: TabHeaderDismissibleProps) {
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
        <TouchableOpacity onPress={() => {}} style={iconStyles}>
          <Text className="text-xl font-bold">{props.options.title}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={iconStyles}>
          <Feather name="x" size={iconSize} color={iconColor} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
