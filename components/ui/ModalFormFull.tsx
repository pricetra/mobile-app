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

import { cn } from '@/lib/utils';

export type ModalFormFullProps = {
  visible: boolean;
  onRequestClose: (event: NativeSyntheticEvent<any>) => void;
  children: ReactNode;
  title: string;
  TitleComponent?: ReactNode;
  className?: string;
};

export default function ModalFormFull({
  children,
  visible,
  onRequestClose,
  title,
  TitleComponent,
  className,
}: ModalFormFullProps) {
  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onRequestClose}>
      <AutocompleteDropdownContextProvider>
        <View className="bg-white">
          <SafeAreaView>
            <View className="flex flex-row items-center justify-between gap-3 border-b-[1px] border-gray-100 pt-2">
              {TitleComponent ? (
                <View className="px-5 py-3">{TitleComponent}</View>
              ) : (
                <Text className="flex flex-1 flex-row items-center gap-2 px-7 py-5 text-2xl font-bold">
                  {title}
                </Text>
              )}

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
              className={cn('px-5', className)}
              nestedScrollEnabled
            />
          </SafeAreaView>
        </View>
      </AutocompleteDropdownContextProvider>
    </Modal>
  );
}
