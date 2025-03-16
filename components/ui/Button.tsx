import { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '@/lib/utils';

export type ButtonProps = {
  children?: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
};

export default function Button({
  children,
  onPress,
  disabled,
  loading,
  className,
  textClassName,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        'active:opacity-800 rounded-md bg-black px-6 py-4 disabled:pointer-events-none disabled:opacity-70',
        className
      )}>
      <View className="flex flex-row items-center justify-center gap-3">
        {loading ? (
          <View className="size-5 animate-ping rounded-full bg-white opacity-75" />
        ) : (
          <Text className={cn('text-center font-bold color-white', textClassName)}>{children}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
