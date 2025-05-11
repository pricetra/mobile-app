import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { Platform, Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import TabHeader, { TabHeaderProps } from '@/components/ui/TabHeader';
import { UserAuthContext } from '@/context/UserContext';
import { createCloudinaryUrl } from '@/lib/files';

export default function TabLayout() {
  const { user } = useContext(UserAuthContext);

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: '#111111',
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
        name="(admin)/users"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="(profile)/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => {
            if (!user.avatar) return <Feather size={size} name="user" color={color} />;
            return (
              <Image
                source={{
                  uri: createCloudinaryUrl(user.avatar, 2 * size, 2 * size),
                }}
                className="rounded-full"
                style={{
                  width: size,
                  height: size,
                }}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="(profile)/myScanData"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="(products)/[productId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="create-product"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
