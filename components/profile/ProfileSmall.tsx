import { Feather } from '@expo/vector-icons';
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
        {user.avatar ? (
          <Image
            source={
              user.avatar
                ? {
                    uri: createCloudinaryUrl(user.avatar, 100, 100),
                  }
                : require('@/assets/images/no_avatar.jpg')
            }
            className="size-16 rounded-full"
          />
        ) : (
          <View className="flex size-16 items-center justify-center rounded-full bg-gray-300">
            <Feather name="user" size={35} />
          </View>
        )}
      </Pressable>

      <View className="flex flex-col gap-1">
        <Text className="text-lg font-bold">{user.name}</Text>
        <Text className="text-sm">{user.email}</Text>
      </View>
    </View>
  );
}
