import Entypo from '@expo/vector-icons/Entypo';
import * as React from 'react';
import { View, Text, Pressable } from 'react-native';

import { cn } from '@/lib/utils';

type PaginationIconProps = { size?: number };

// ---------- Icon helpers ----------
const IconLeft = ({ size = 20 }: PaginationIconProps) => (
  <Entypo name="chevron-small-left" size={size} color="black" />
);

const IconRight = ({ size = 20 }: PaginationIconProps) => (
  <Entypo name="chevron-small-right" size={size} color="black" />
);

const IconEllipsis = ({ size = 8 }: PaginationIconProps) => (
  <Entypo name="dots-three-horizontal" size={size} color="black" />
);

type PaginationRootComponentProps = {
  children: React.ReactNode;
  className?: string;
};

// ---------- Pagination Root ----------
export const Pagination = ({ children, className }: PaginationRootComponentProps) => {
  return <View className={cn('w-full items-center', className)}>{children}</View>;
};

// ---------- Content ----------
export const PaginationContent = ({ children, className }: PaginationRootComponentProps) => {
  return (
    <View className={cn('flex-row flex-wrap items-center justify-center gap-1', className)}>
      {children}
    </View>
  );
};

// ---------- Item ----------
export const PaginationItem = ({ children, className }: PaginationRootComponentProps) => {
  return <View className={className}>{children}</View>;
};

// ---------- Link (Button) ----------
export const PaginationLink = ({
  label,
  isActive,
  onPress,
  disabled,
  className,
}: {
  label: React.ReactNode | 'string';
  isActive?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        'h-9 min-w-9 items-center justify-center rounded-md px-2',
        isActive ? 'border-[1px] border-gray-200 shadow-black/10' : '',
        disabled ? 'opacity-40' : 'opacity-100',
        className
      )}>
      {typeof label === 'string' ? (
        <Text className={`text-sm ${isActive ? 'font-semibold' : ''}`}>{label}</Text>
      ) : (
        label
      )}
    </Pressable>
  );
};

type PageControlBtnProps = {
  onPress?: () => void;
  disabled?: boolean;
  showLabel?: boolean;
};

// ---------- Previous ----------
export const PaginationPrevious = ({ onPress, disabled, showLabel = false }: PageControlBtnProps) => {
  return (
    <PaginationLink
      onPress={onPress}
      disabled={disabled}
      label={
        <View className="flex-row items-center gap-1">
          <IconLeft />
          {showLabel && <Text className="text-sm">Prev</Text>}
        </View>
      }
    />
  );
};

// ---------- Next ----------
export const PaginationNext = ({ onPress, disabled, showLabel = false }: PageControlBtnProps) => {
  return (
    <PaginationLink
      onPress={onPress}
      disabled={disabled}
      label={
        <View className="flex-row items-center gap-1">
          {showLabel && <Text className="text-sm">Next</Text>}
          <IconRight />
        </View>
      }
    />
  );
};

// ---------- Ellipsis ----------
export const PaginationEllipsis = () => {
  return (
    <View className="h-9 w-7 items-center justify-center">
      <IconEllipsis />
    </View>
  );
};
