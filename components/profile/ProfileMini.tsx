import { View, Image, Text } from 'react-native';

import { User } from '@/graphql/types/graphql';
import { createCloudinaryUrl } from '@/lib/files';

export type ProfileMiniProps = {
  user: User;
};

export default function ProfileMini({ user }: ProfileMiniProps) {
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
        className="size-12 rounded-full"
      />

      <View className="flex flex-col gap-1">
        <Text className="text-[15px] font-bold">{user.name}</Text>
        <Text className="text-[11px]">{user.email}</Text>
      </View>
    </View>
  );
}
