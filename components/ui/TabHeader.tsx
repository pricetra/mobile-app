import { Feather, Octicons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { Platform, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';

export type TabHeaderProps = BottomTabHeaderProps;

export default function TabHeader(props: TabHeaderProps) {
  return (
    <SafeAreaView className="flex w-full bg-gray-900">
      <View
        className="w-full flex-row items-center justify-between gap-2 px-5 py-4"
        style={{ marginTop: Platform.OS === 'android' ? 20 : 0 }}>
        <View className="flex flex-row items-center justify-center gap-3">
          {props.options.tabBarIcon &&
            props.options.tabBarIcon({ focused: true, color: '#e2e8f0', size: 25 })}
          <Text className="text-xl font-bold text-slate-200">{props.options.title}</Text>
        </View>

        {/* <TouchableOpacity
          onPress={() => router.push('/internal/stores')}
          className="flex flex-row items-center justify-center gap-2 rounded-full bg-slate-700 px-5 py-2">
          <Octicons name="organization" color="white" size={15} />
          <Text className="text-sm font-bold color-white">Stores</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}
