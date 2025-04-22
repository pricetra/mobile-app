import { Feather } from '@expo/vector-icons';
import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  NativeSyntheticEvent,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  SafeAreaView,
  FlatList,
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
      <AutocompleteDropdownContextProvider>
        <Pressable
          className="h-full"
          onPress={onRequestClose}
          style={{ backgroundColor: visible ? 'rgba(0,0,0,.7)' : 'rgba(0,0,0,0)' }}
        />
        <KeyboardAvoidingView
          behavior="position"
          className="max-h-screen-safe-offset-0 absolute bottom-0 left-0 h-fit w-full">
          <SafeAreaView
            style={{ backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
            <View className="flex flex-row items-center justify-between gap-3 border-b-[1px] border-gray-100 pt-2">
              <Text className="flex flex-1 flex-row items-center gap-2 px-7 py-5 text-2xl font-bold">
                {title}
              </Text>

              <TouchableOpacity
                onPress={onRequestClose}
                className="flex items-center justify-center p-5">
                <Feather name="x" size={25} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={[{ key: 'form' }]} // Dummy data to render form
              keyExtractor={(item) => item.key}
              renderItem={() => <>{children}</>}
              ListHeaderComponent={<View className="h-5" />}
              ListFooterComponent={<View className="h-5" />}
              keyboardShouldPersistTaps="handled"
              contentInsetAdjustmentBehavior="automatic"
              className="px-5"
              nestedScrollEnabled
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </AutocompleteDropdownContextProvider>
    </Modal>
  );
}
