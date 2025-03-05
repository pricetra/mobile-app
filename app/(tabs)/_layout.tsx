import { Feather } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Platform, View, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { JWT_KEY, UserContextProvider } from '@/context/UserContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [jwt, setJwt] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    SecureStore.getItemAsync(JWT_KEY)
      .then((jwt) => {
        if (!jwt || jwt === '') {
          return router.replace('/login');
        }
        setJwt(jwt);
      })
      .catch(() => router.replace('/login'));
  }, []);

  if (!jwt) return <></>;

  return (
    <UserContextProvider jwt={jwt}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
          header: (props) => (
            <View className="bg-slate-800 p-5 pt-16">
              <View className="flex flex-row items-center justify-start gap-5">
                {props.options.tabBarIcon &&
                  props.options.tabBarIcon({ focused: true, color: '#e2e8f0', size: 30 })}
                <Text className="text-2xl font-bold text-slate-200">{props.options.title}</Text>
              </View>
            </View>
          ),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Feather size={28} name="home" color={color} />, // https://icons.expo.fyi/Index
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: 'Scan',
            tabBarIcon: ({ color }) => <Feather size={28} name="camera" color={color} />, // https://icons.expo.fyi/Index
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <Feather size={28} name="compass" color={color} />,
          }}
        />
      </Tabs>
    </UserContextProvider>
  );
}
