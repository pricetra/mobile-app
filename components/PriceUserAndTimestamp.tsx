import dayjs from 'dayjs';
import { View, Text, Image } from 'react-native';

import { CreatedByUser, UpdatedByUser } from 'graphql-utils';
import { createCloudinaryUrl } from '@/lib/files';

export type PriceUserAndTimestampProps = {
  user: CreatedByUser | UpdatedByUser;
  timestamp?: any;
};

export default function PriceUserAndTimestamp({ user, timestamp }: PriceUserAndTimestampProps) {
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
        <Text className="text-xs font-bold">{user.name}</Text>
        {timestamp && <Text className="mt-0.5 text-xs italic">{dayjs(timestamp).fromNow()}</Text>}
      </View>
    </View>
  );
}
