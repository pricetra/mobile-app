import { ReactNode } from 'react';
import { GestureResponderEvent, Platform, TouchableOpacity, View } from 'react-native';

export type FloatingActionButtonProps = {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
};

export default function FloatingActionButton({ children, onPress }: FloatingActionButtonProps) {
  return (
    <View
      className="absolute right-0 z-10 p-5"
      style={{ bottom: Platform.OS === 'android' ? 0 : 75 }}>
      <TouchableOpacity
        onPress={onPress}
        className="flex flex-row items-center justify-center gap-2 rounded-full bg-gray-900 px-5 py-3 shadow-lg">
        {children}
      </TouchableOpacity>
    </View>
  );
}
