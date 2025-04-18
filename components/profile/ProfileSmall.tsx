import { Pressable, View, Image, Text } from 'react-native';

import { User } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export type ProfileSmallProps = {
  user: User;
  selectProfileAvatar?: () => void;
};

export default function ProfileSmall({ user, selectProfileAvatar }: ProfileSmallProps) {
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
        <Text className="text-[16px] font-bold">{user.name}</Text>
        <Text className="text-[12px]">{user.email}</Text>
      </View>
    </View>
  );
}
