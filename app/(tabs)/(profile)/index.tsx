import { Feather } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';

import ProfileForm from '@/components/profile/ProfileForm';
import ProfileTiny from '@/components/profile/ProfileTiny';
import ModalFormMini from '@/components/ui/ModalFormMini';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { UserAuthContext } from '@/context/UserContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, updateUser } = useContext(UserAuthContext);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        header: (props: BottomTabHeaderProps) => (
          <TabHeaderItem
            {...props}
            leftNav={<ProfileTiny user={user} />}
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
          onSuccess={(updatedUser) => {
            updateUser({
              ...user,
              ...updatedUser,
            });
            setOpenSettingsModal(false);
          }}
          onError={(e) => Alert.alert('Could not edit profile', e.message)}
        />
      </ModalFormMini>

      <ScrollView />
    </SafeAreaView>
  );
}
