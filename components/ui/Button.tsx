import { ReactNode } from 'react';
import { Pressable, View, Text } from 'react-native';

export type ButtonProps = {
  children?: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string
};

export default function Button({ children, onPress, disabled, loading, className }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-md bg-slate-600 px-6 py-4 active:bg-slate-700 disabled:pointer-events-none disabled:opacity-70 ${className}`}>
      <View className="flex flex-row items-center justify-center gap-3">
        {loading ? (
          <View className="mr-3 size-5 animate-ping rounded-full bg-white opacity-75" />
        ) : (
          <Text className="text-center font-bold color-white">{children}</Text>
        )}
      </View>
    </Pressable>
  );
}
