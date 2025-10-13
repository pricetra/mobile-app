import clsx from 'clsx';
import { ReactNode } from 'react';
import { GestureResponderEvent, TouchableOpacity, View } from 'react-native';

import { cn } from '@/lib/utils';

export type FloatingActionButtonProps = {
  children: ReactNode;
  className?: clsx.ClassValue;
  btnClassName?: clsx.ClassValue;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export default function FloatingActionButton({
  children,
  className,
  btnClassName,
  onPress,
  disabled,
}: FloatingActionButtonProps) {
  return (
    <View
      className={cn(
        'bottom-safe-offset-0 absolute left-0 z-10 flex w-full flex-row items-center justify-center',
        className
      )}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={1}
        className={cn(
          'flex flex-row items-center justify-center gap-2 rounded-full bg-pricetraGreenHeavyDark px-5 py-3 shadow-lg',
          btnClassName
        )}>
        {children}
      </TouchableOpacity>
    </View>
  );
}
