import clsx from 'clsx';
import { ReactNode } from 'react';
import {
  ActivityIndicator,
  ColorValue,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

import { cn } from '@/lib/utils';

export type BtnProps = TouchableOpacityProps & {
  text?: string;
  textWeight?: 'light' | 'normal' | 'semibold' | 'bold' | 'black';
  textSize?: clsx.ClassValue;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  bgColor?: clsx.ClassValue;
  color?: clsx.ClassValue;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  iconColor?: ColorValue;
  rounded?: 'full' | 'xl';
  iconRight?: boolean;
};

export default function Btn({
  text,
  textWeight = 'bold',
  icon,
  loading,
  size = 'md',
  disabled,
  bgColor = 'bg-pricetraGreenHeavyDark',
  color = 'color-white',
  iconColor = 'white',
  rounded = 'xl',
  iconRight,
  textSize,
  ...props
}: BtnProps) {
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || loading}
      activeOpacity={0.5}
      className={cn(
        'relative flex items-center justify-center gap-3 bg-pricetraGreenHeavyDark',
        bgColor,
        iconRight ? 'flex-row-reverse' : 'flex-row',
        size === 'xs' ? 'px-4 py-1.5' : '',
        size === 'sm' ? 'px-5 py-2' : '',
        size === 'md' ? 'px-9 py-3' : '',
        size === 'lg' ? 'gap-5 px-11 py-5' : '',
        rounded === 'xl' ? 'rounded-xl' : '',
        rounded === 'full' ? 'rounded-full' : '',
        props.className
      )}
      style={{
        opacity: disabled || loading ? 0.5 : props.activeOpacity,
      }}>
      {loading && (
        <ActivityIndicator
          size="small"
          color={iconColor}
          className="absolute h-full w-full slide-out-to-left-1/2 slide-out-to-top-1/2"
        />
      )}
      {icon && <View className={loading ? 'opacity-0' : 'opacity-100'}>{icon}</View>}
      {text && (
        <Text
          className={cn(
            textWeight === 'light' ? 'font-light' : '',
            textWeight === 'normal' ? 'font-normal' : '',
            textWeight === 'semibold' ? 'font-semibold' : '',
            textWeight === 'bold' ? 'font-bold' : '',
            textWeight === 'black' ? 'font-black' : '',
            color,
            size === 'xs' ? 'text-sm' : '',
            size === 'sm' ? 'text-md' : '',
            size === 'md' ? 'text-lg' : '',
            size === 'lg' ? 'text-xl' : '',
            loading ? 'opacity-0' : 'opacity-100',
            textSize
          )}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}
