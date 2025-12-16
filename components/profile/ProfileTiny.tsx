import { View, Image, Text } from 'react-native';

import { User } from 'graphql-utils';
import { createCloudinaryUrl } from '@/lib/files';

export type ProfileTinyProps = {
  user: User;
};

export default function ProfileTiny({ user }: ProfileTinyProps) {
  return (
    <View className="flex flex-row items-center justify-start gap-3">
      <Image
        source={
          user.avatar
            ? {
                uri: createCloudinaryUrl(user.avatar, 100, 100),
              }
            : require('@/assets/images/no_avatar.jpg')
        }
        className="size-10 rounded-full"
      />

      <View className="flex flex-col gap-1">
        <Text className="text-[13px] font-bold">{user.name}</Text>
        <Text className="text-[10px]">{user.email}</Text>
      </View>
    </View>
  );
}
