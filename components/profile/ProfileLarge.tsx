import { Pressable, View, Image, Text } from 'react-native';

import { User } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';
import { Skeleton } from '../ui/Skeleton';

export type ProfileLargeProps = {
  user: User;
  selectProfileAvatar?: () => void;
};

export default function ProfileLarge({ user, selectProfileAvatar }: ProfileLargeProps) {
  return (
    <View className="flex flex-row items-center justify-start gap-3">
      <Pressable onPress={selectProfileAvatar}>
        <Image
          source={
            user.avatar
              ? {
                  uri: createCloudinaryUrl(user.avatar, 100, 100),
                }
              : require('@/assets/images/no_avatar.jpg')
          }
          className="size-14 rounded-full"
        />
      </Pressable>

      <View className="flex flex-col gap-1">
        <Text className="text-[10px] capitalize text-gray-600">
          {user.role.split('_').join(' ')}
          {user.active && ' • Active'}
        </Text>
        <Text className="text-[15px] font-bold">{user.name}</Text>
        <Text className="text-[11px]">{user.email}</Text>
      </View>
    </View>
  );
}

export function ProfileLargeLoading() {
  return (
    <View className="flex flex-row items-center justify-start gap-3">
      <Skeleton className="size-14 rounded-full" />

      <View className="flex flex-col gap-1">
        <Skeleton className="h-3 w-[50px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-3 w-[140px]" />
      </View>
    </View>
  );
}
