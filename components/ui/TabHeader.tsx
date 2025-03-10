import { Feather } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { Platform, Pressable, SafeAreaView, View, Text } from 'react-native';

export type TabHeaderProps = BottomTabHeaderProps;

export default function TabHeader(props: TabHeaderProps) {
  return (
    <SafeAreaView className="flex w-full bg-gray-900">
      <View
        className="w-full flex-row items-center justify-between gap-2 px-5 py-5"
        style={{ marginTop: Platform.OS === 'android' ? 20 : 0 }}>
        <View className="flex flex-row items-center justify-center gap-3">
          {props.options.tabBarIcon &&
            props.options.tabBarIcon({ focused: true, color: '#e2e8f0', size: 30 })}
          <Text className="text-2xl font-bold text-slate-200">{props.options.title}</Text>
        </View>

        <Pressable
          onPress={() => router.push('/internal/create-company')}
          className="flex flex-row items-center justify-center gap-3 rounded-full bg-slate-700 px-5 py-2">
          <Feather name="plus" color="white" size={20} />
          <Text className="font-bold color-white">Company</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
