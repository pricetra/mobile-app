import { Feather } from '@expo/vector-icons';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

import { cn } from '@/lib/utils';
import { ModalProps } from '@/types/modal';

export type ModalFormFullProps = ModalProps;

export default function ModalFormFull({
  children,
  visible,
  onRequestClose,
  title,
  TitleComponent,
  className,
}: ModalFormFullProps) {
  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onRequestClose} transparent>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <AutocompleteDropdownContextProvider>
          <View className="bg-white">
            <KeyboardAvoidingView behavior="padding">
              <SafeAreaView>
                <View className="flex flex-row items-center justify-between gap-3 border-b-[1px] border-gray-100">
                  {TitleComponent ? (
                    <View className="px-5 py-3">{TitleComponent}</View>
                  ) : (
                    <Text className="flex flex-1 flex-row items-center gap-2 px-7 py-3 text-xl font-bold">
                      {title}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={onRequestClose}
                    className="flex items-center justify-center px-5 py-3">
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
                  className={cn('px-5', className)}
                  nestedScrollEnabled
                />
              </SafeAreaView>
            </KeyboardAvoidingView>
          </View>
        </AutocompleteDropdownContextProvider>
      </View>
    </Modal>
  );
}
