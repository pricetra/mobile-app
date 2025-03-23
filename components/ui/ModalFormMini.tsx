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
        className="absolute bottom-0 left-0 h-fit max-h-full w-full rounded-t-2xl bg-white shadow-2xl">
        <SafeAreaView>
          <View className="flex flex-row items-center justify-between gap-3 border-b-[1px] border-gray-100">
            <Text className="flex flex-1 flex-row items-center gap-2 px-7 py-5 text-2xl font-bold">
              {title}
            </Text>

            <TouchableOpacity
              onPress={onRequestClose}
              className="flex items-center justify-center p-5">
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
