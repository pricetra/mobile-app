import { Feather } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import TabHeader, { TabHeaderProps } from '@/components/ui/TabHeader';
import { Colors } from '@/constants/Colors';
import { JWT_KEY, UserContextProvider } from '@/context/UserContext';
import { ApolloContext } from '@/graphql/ApolloWrapper';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const apolloContext = useContext(ApolloContext);
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
        apolloContext.setAuthHeader(jwt);
      })
      .catch(() => router.replace('/login'));
  }, []);

  if (!jwt) return <></>;

  return (
    <UserContextProvider jwt={jwt}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor:
            Platform.OS === 'android' ? Colors['light'].tint : Colors[colorScheme ?? 'light'].tint,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
          header: (props) => <TabHeader {...(props as unknown as TabHeaderProps)} />,
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
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Feather size={28} name="user" color={color} />,
            headerShown: false,
          }}
        />
      </Tabs>
    </UserContextProvider>
  );
}
