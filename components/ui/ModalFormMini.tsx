import { Feather } from '@expo/vector-icons';
import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

export type ModalFormMiniProps = {
  visible: boolean;
  onRequestClose: (event: NativeSyntheticEvent<any>) => void;
  children: ReactNode;
  title: string;
};

export default function ModalFormMini({
  children,
  visible,
  onRequestClose,
  title,
}: ModalFormMiniProps) {
  return (
    <Modal animationType="fade" visible={visible} onRequestClose={onRequestClose} transparent>
      <Pressable
        className="h-full"
        onPress={onRequestClose}
        style={{ backgroundColor: visible ? 'rgba(0,0,0,.7)' : 'rgba(0,0,0,0)' }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="absolute bottom-0 left-0 z-50 h-fit max-h-full w-full rounded-t-2xl bg-white py-7 shadow-2xl">
        <SafeAreaView>
          <View className="flex flex-row items-center justify-between gap-6 border-b-[1px] border-gray-100 px-7 pb-5">
            <Text className="flex flex-row items-center gap-2 text-2xl font-bold">{title}</Text>

            <TouchableOpacity
              onPress={onRequestClose}
              className="flex size-10 items-center justify-center">
              <Feather name="x" size={25} />
            </TouchableOpacity>
          </View>
          <ScrollView
            className="px-7"
            nestedScrollEnabled
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic">
            <View className="h-5" />
            <AutocompleteDropdownContextProvider>
              <View>{children}</View>
            </AutocompleteDropdownContextProvider>
            <View className="h-20" />
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
