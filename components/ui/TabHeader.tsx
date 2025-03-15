import { Ionicons } from '@expo/vector-icons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Platform, SafeAreaView, View, TouchableOpacity } from 'react-native';

export type TabHeaderProps = BottomTabHeaderProps;

export default function TabHeader(props: TabHeaderProps) {
  return (
    <SafeAreaView className="flex w-full bg-gray-900">
      <View
        className="w-full flex-row items-center justify-center gap-3 px-5 py-4"
        style={{ marginTop: Platform.OS === 'android' ? 30 : 0 }}>
        <TouchableOpacity
          onPress={() => {
            if (props.options.title || props.options.tabBarIcon) return;
            router.back();
          }}>
          {props.options.tabBarIcon ? (
            props.options.tabBarIcon({ focused: true, color: '#e2e8f0', size: 20 })
          ) : (
            <Ionicons name="chevron-back-outline" color="#e2e8f0" size={20} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/')}
          className="flex w-full flex-1 items-center justify-center">
          <Image
            source={require('../../assets/images/logotype_white_color.svg')}
            style={{ height: 27, width: 115 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(tabs)/')}>
          <Ionicons name="search" color="#e2e8f0" size={20} />
        </TouchableOpacity>

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
