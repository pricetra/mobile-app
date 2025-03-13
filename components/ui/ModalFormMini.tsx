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
} from 'react-native';

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
        style={{ backgroundColor: visible ? 'rgba(0,0,0,.3)' : 'rgba(0,0,0,0)' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="absolute bottom-0 left-0 z-50 h-fit w-full rounded-t-2xl bg-white px-7 py-10 shadow-2xl">
          <View className="mb-10 flex flex-row items-center justify-between gap-6">
            <Text className="flex flex-row items-center gap-2 text-2xl font-bold">{title}</Text>

            <TouchableOpacity
              onPress={onRequestClose}
              className="flex size-10 items-center justify-center">
              <Feather name="x" size={25} />
            </TouchableOpacity>
          </View>
          <ScrollView>{children}</ScrollView>
          <View className="h-20" />
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
