import { Octicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

import { useAuth } from '@/context/UserContext';

export default function WelcomeModal() {
  const { user, lists } = useAuth();
  const [openWelcomeModal, setOpenWelcomeModal] = useState(false);

  useEffect(() => {
    if (!user.addressId || !user.address) {
      return setOpenWelcomeModal(true);
    }
    if (lists.favorites.branchList && lists.favorites.branchList.length === 0) {
      return setOpenWelcomeModal(true);
    }
  }, [user]);

  return (
    <Modal visible={openWelcomeModal} animationType="slide" transparent>
      <View style={{ flex: 1 }} className="bg-white">
        <ScrollView>
          <SafeAreaView>
            <View className="flex w-full flex-col justify-center gap-5 p-5 pt-[20vh]">
              <Text className="text-5xl font-extrabold text-pricetraGreenHeavyDark">
                Let's Setup Your Account...
              </Text>

              <Text className="mb-14 text-lg text-gray-800">
                In order to help you shop efficiently, we will need just a little more information
                from you. This won't take long.
              </Text>

              <TouchableOpacity className="flex flex-row items-center justify-center gap-5 rounded-xl bg-pricetraGreenHeavyDark px-7 py-5">
                <Octicons name="location" size={28} color="white" />
                <Text className="text-lg font-bold color-white">Add Your Address</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    </Modal>
  );
}
