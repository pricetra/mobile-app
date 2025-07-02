import { AntDesign, Entypo, Feather, MaterialIcons, Octicons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import dayjs from 'dayjs';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, Alert, View } from 'react-native';

import ProfileForm from '@/components/profile/ProfileForm';
import ProfileSmall from '@/components/profile/ProfileSmall';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { UserAuthContext } from '@/context/UserContext';
import { ListType } from '@/graphql/types/graphql';

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
  const { user, lists } = useContext(UserAuthContext);
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
            rightNav={
              <TouchableOpacity
                onPress={() => setOpenSettingsModal(true)}
                className="flex flex-row items-center gap-2 rounded-full p-2">
                <Feather name="settings" size={20} color="#396a12" />
              </TouchableOpacity>
            }
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
    <SafeAreaView style={{ height: '100%' }}>
      <ModalFormMini
        visible={openSettingsModal}
        onRequestClose={() => setOpenSettingsModal(false)}
        title="Edit Profile">
        <ProfileForm
          user={user}
          onCancel={() => setOpenSettingsModal(false)}
          onSuccess={(_u) => setOpenSettingsModal(false)}
          onError={(e) => Alert.alert('Could not edit profile', e.message)}
        />
      </ModalFormMini>

      <ScrollView className="p-5">
        <View className="mt-5">
          <Text className="text-2xl font-bold">Details</Text>

          <View className="mt-5 flex flex-col gap-5 rounded-lg border-[1px] border-gray-100 bg-gray-50 p-5">
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
                <Entypo name="cake" size={20} color="black" />
                <Text>{dayjs.utc(user.birthDate).format('LL')}</Text>
              </View>
            )}
          </View>
        </View>

        <View className="mt-16">
          <Text className="text-2xl font-bold">Lists</Text>

          {lists.allLists.length > 0 && (
            <View className="mt-5 flex flex-col gap-2">
              {lists.allLists.map((list) => (
                <TouchableOpacity
                  key={list.id}
                  onPress={() => router.push('/(tabs)/(profile)/list')}
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
      </ScrollView>
    </SafeAreaView>
  );
}
