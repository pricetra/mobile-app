import { Feather } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import Button from '@/components/ui/Button';
import { UserAuthContext } from '@/context/UserContext';

export default function ProfileScreen() {
  const { user, logout } = useContext(UserAuthContext);
  const [logoutLoading, setLogoutLoading] = useState(false);

  return (
    <SafeAreaView>
      <View className="p-5">
        <View className="mt-20 flex flex-row items-center justify-start gap-3">
          <View className="flex size-20 items-center justify-center rounded-full bg-gray-300">
            <Feather name="user" size={35} />
          </View>

          <View className="flex flex-col gap-1">
            <Text className="text-xl font-bold">{user.name}</Text>
            <Text>{user.email}</Text>
          </View>
        </View>

        <View className="mt-10">
          <Button
            onPress={() => {
              setLogoutLoading(true);
              logout();
            }}
            loading={logoutLoading}>
            Logout
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
