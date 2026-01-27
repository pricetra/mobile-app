import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import { CreatedByUser, UpdatedByUser } from 'graphql-utils';
import { View, Text, Image } from 'react-native';

import { createCloudinaryUrl } from '@/lib/files';

export type PriceUserAndTimestampProps = {
  user: CreatedByUser | UpdatedByUser;
  timestamp?: any;
  verified?: boolean;
};

export default function PriceUserAndTimestamp({
  user,
  timestamp,
  verified,
}: PriceUserAndTimestampProps) {
  return (
    <View className="flex flex-row items-center gap-2">
      <Image
        source={
          user.avatar
            ? {
                uri: createCloudinaryUrl(user.avatar, 100, 100),
              }
            : require('@/assets/images/no_avatar.jpg')
        }
        className="size-[25px] rounded-full"
      />
      <View>
        <View className="flex-row items-center gap-1">
          <Text className="text-xs font-bold">{user.name}</Text>
          {verified && <MaterialIcons name="verified-user" size={15} color="#5fae23" />}
        </View>
        {timestamp && <Text className="mt-0.5 text-xs italic">{dayjs(timestamp).fromNow()}</Text>}
      </View>
    </View>
  );
}
