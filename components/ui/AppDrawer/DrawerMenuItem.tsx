import React from 'react';
import { Pressable, Text } from 'react-native';

export type DrawerMenuItemProps = {
  onPress: () => void;
  text: string;
  icon?: (props: { color: string; size: number }) => React.ReactNode;
};

export default function DrawerMenuItem({ onPress, text, icon }: DrawerMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex flex-row items-center justify-start gap-7 rounded-lg px-5 py-4 active:bg-gray-100">
      {icon && icon({ size: 17, color: '#000' })}
      <Text>{text}</Text>
    </Pressable>
  );
}
