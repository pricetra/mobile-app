import { Feather, MaterialIcons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { Platform, Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import TabHeader from '@/components/ui/TabHeader';
import TabHeaderItem from '@/components/ui/TabHeaderItem';
import { UserAuthContext } from '@/context/UserContext';
import { createCloudinaryUrl } from '@/lib/files';

export default function TabLayout() {
  const { user } = useContext(UserAuthContext);

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: '#396a12',
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
        }),
        header: (props) => <TabHeader {...props} />,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="grocery-list"
        options={{
          title: 'Groceries',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="list-check" size={size - 2} color={color} />
          ), // https://icons.expo.fyi/Index
        }}
      />
      <Tabs.Screen
        name="(scan)/index"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="barcode-scan" size={size} color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
          animation: 'shift',
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
        name="(stores)/[storeId]"
        options={{
          href: null,
          header: (props) => <TabHeaderItem {...props} />,
          animation: 'shift',
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="(stores)/[storeId]/branch/[branchId]"
        options={{
          href: null,
          header: (props) => <TabHeaderItem {...props} />,
          animation: 'shift',
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="(admin)/users"
        options={{
          href: null,
          header: (props) => <TabHeaderItem {...props} />,
          animation: 'shift',
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="(profile)/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => {
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
                  opacity: focused ? 1 : 0.8,
                }}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="(profile)/list/[listId]"
        options={{
          href: null,
          animation: 'shift',
          header: (props) => <TabHeaderItem {...props} />,
          title: 'My List',
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="(profile)/my-scan-data"
        options={{
          href: null,
          header: (props) => <TabHeaderItem {...props} />,
          animation: 'shift',
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="(products)/[productId]"
        options={{
          href: null,
          animation: 'shift',
          header: (props) => <TabHeaderItem {...props} />,
          title: 'Product',
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
