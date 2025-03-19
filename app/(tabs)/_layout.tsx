import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import TabHeader, { TabHeaderProps } from '@/components/ui/TabHeader';

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: Platform.OS === 'android' ? '#111111' : '#ffffff',
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
          tabBarIcon: ({ color, size }) => <Feather size={size} name="home" color={color} />, // https://icons.expo.fyi/Index
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <Feather size={size} name="camera" color={color} />, // https://icons.expo.fyi/Index
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="(stores)/index"
        options={{
          title: 'Stores',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons size={size} name="storefront" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(stores)/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Feather size={size} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
