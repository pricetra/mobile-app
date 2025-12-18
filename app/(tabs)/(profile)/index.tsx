import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome5,
  MaterialIcons,
  Octicons,
} from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import dayjs from 'dayjs';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { ListType, UserRole } from 'graphql-utils';
import { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, Alert, View, ActivityIndicator } from 'react-native';

import ProfileForm from '@/components/profile/ProfileForm';
import ProfileSmall from '@/components/profile/ProfileSmall';
import ModalFormFull from '@/components/ui/ModalFormFull';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { useAuth } from '@/context/UserContext';
import { isRoleAuthorized } from '@/lib/roles';

export function ListIconRenderer(type: ListType) {
  switch (type) {
    case ListType.WatchList:
      return <AntDesign name="eye" size={20} color="#a855f7" />;
    case ListType.Favorites:
      return <AntDesign name="heart" size={15} color="#e11d48" />;
    default:
      return <MaterialIcons name="bookmark" size={20} color="#396a12" />;
  }
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, lists, logout, loggingOut } = useAuth();
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        header: (props: BottomTabHeaderProps) => (
          <TabHeaderItem
            {...props}
            leftNav={
              <View className="flex flex-row items-center gap-3">
                <View className="flex size-[35px] items-center justify-center rounded-full bg-pricetraGreenHeavyDark/10">
                  <Feather name="user" size={20} color="#396a12" />
                </View>
                <Text className="font-bold" numberOfLines={1}>
                  My Profile
                </Text>
              </View>
            }
            rightNav={<></>}
          />
        ),
      });
      return () => {
        navigation.setOptions({
          header: (props: BottomTabHeaderProps) => <TabHeaderItem {...props} />,
        });
      };
    }, [user])
  );

  return (
    <ScrollView className="p-5">
      <ModalFormFull
        visible={openSettingsModal}
        onRequestClose={() => setOpenSettingsModal(false)}
        title="Edit Profile">
        <ProfileForm
          user={user}
          onCancel={() => setOpenSettingsModal(false)}
          onSuccess={(_u) => setOpenSettingsModal(false)}
          onError={(e) => Alert.alert('Could not edit profile', e.message)}
        />
      </ModalFormFull>

      <View className="flex flex-col gap-5 rounded-lg border-[1px] border-gray-100 bg-gray-50 p-5">
        <View className="mb-5">
          <ProfileSmall user={user} />
        </View>

        {user.address && (
          <View className="flex flex-row items-center gap-5">
            <Octicons name="location" size={20} color="black" />
            <Text>{user.address.fullAddress}</Text>
          </View>
        )}

        {user.birthDate && (
          <View className="flex flex-row items-center gap-5">
            <MaterialIcons name="cake" size={20} color="black" />
            <Text>{dayjs.utc(user.birthDate).format('LL')}</Text>
          </View>
        )}
      </View>

      <View className="mt-10">
        <Text className="text-2xl font-bold">Navigation</Text>

        <View className="mt-5 flex flex-col">
          <NavigationItem
            onPress={() =>
              router.push('/(tabs)/(profile)/my-scan-data', { relativeToDirectory: false })
            }
            icon={<MaterialIcons name="data-object" size={20} color="black" />}
            text="My Scan Data"
          />

          {isRoleAuthorized(UserRole.Admin, user.role) && (
            <NavigationItem
              onPress={() => router.push('/(tabs)/(admin)/users', { relativeToDirectory: false })}
              icon={<Feather name="users" size={20} color="black" />}
              text="Manage Users"
            />
          )}

          <NavigationItem
            onPress={() => setOpenSettingsModal(true)}
            icon={<FontAwesome5 name="user-edit" size={17} color="black" />}
            text="Edit Profile"
          />

          <NavigationItem
            onPress={() =>
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                {
                  text: 'Cancel',
                  style: 'cancel',
                  isPreferred: true,
                },
                {
                  text: 'Logout',
                  style: 'destructive',
                  onPress: logout,
                },
              ])
            }
            icon={
              loggingOut ? (
                <ActivityIndicator />
              ) : (
                <Feather name="power" size={20} color="#ef4444" />
              )
            }
            text={loggingOut ? 'Logging out' : 'Logout'}
          />
        </View>
      </View>

      <View className="mt-16">
        <Text className="text-2xl font-bold">Lists</Text>

        {lists.allLists.length > 0 && (
          <View className="mt-5 flex flex-col gap-2">
            {lists.allLists.map((list) => (
              <TouchableOpacity
                key={list.id}
                onPress={() =>
                  router.push(`/(tabs)/(profile)/list/${list.id}`, { relativeToDirectory: false })
                }
                className="flex flex-row items-center justify-between gap-5 px-0 py-2">
                <View className="flex flex-1 flex-row items-center gap-5 px-0 py-2">
                  <View className="flex size-[45px] items-center justify-center rounded-full bg-gray-100">
                    {ListIconRenderer(list.type)}
                  </View>
                  <View>
                    <Text className="text-lg font-bold">{list.name}</Text>
                    <View className="flex flex-row items-center justify-between gap-1">
                      <Text className="text-sm">{list.productList?.length} Products</Text>
                      <Entypo name="dot-single" size={15} color="black" />
                      <Text className="text-sm">{list.branchList?.length ?? 0} Branches</Text>
                    </View>
                  </View>
                </View>

                <Feather name="chevron-right" size={24} color="black" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View className="h-[200px]" />
    </ScrollView>
  );
}

function NavigationItem({
  onPress,
  text,
  icon,
}: {
  onPress: () => void;
  text: string;
  icon: React.ReactElement;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-1 flex flex-row items-center justify-between gap-5">
      <View className="flex flex-1 flex-row items-center gap-5 px-0 py-2">
        <View className="flex size-[45px] items-center justify-center rounded-full bg-gray-100">
          {icon}
        </View>
        <View>
          <Text className="text-lg">{text}</Text>
        </View>
      </View>

      <Feather name="chevron-right" size={24} color="black" />
    </TouchableOpacity>
  );
}
