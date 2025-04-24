import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useContext, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';

import DrawerMenuItem from './AppDrawer/DrawerMenuItem';

import ProfileMini from '@/components/profile/ProfileMini';
import { useDrawer } from '@/context/DrawerContext';
import { UserAuthContext } from '@/context/UserContext';
import { UserRole } from '@/graphql/types/graphql';
import { isRoleAuthorized } from '@/lib/roles';
import { cn } from '@/lib/utils';

const { width } = Dimensions.get('window');

export default function AppDrawer() {
  const { user, logout } = useContext(UserAuthContext);
  const { isOpen, closeDrawer } = useDrawer();

  const slideAnim = useRef(new Animated.Value(-width)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  function toRoute(cb: () => void) {
    cb();
    closeDrawer();
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={closeDrawer}>
        <Animated.View
          pointerEvents={isOpen ? 'auto' : 'none'}
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Sliding Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}>
        <SafeAreaView className={cn('h-full pb-10', Platform.OS === 'android' && 'pt-10')}>
          <View className="flex h-full flex-col justify-between">
            <View className="flex flex-row items-center justify-between gap-3 border-b-[1px] border-gray-100">
              <View className="flex-1 p-5 text-2xl font-bold">
                <ProfileMini user={user} />
              </View>

              <TouchableOpacity
                onPress={closeDrawer}
                className="flex items-center justify-center bg-white p-5">
                <Feather name="x" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View className="flex w-full flex-1 flex-col gap-2 p-2">
                <DrawerMenuItem
                  onPress={() => toRoute(() => router.push('/'))}
                  text="Home"
                  icon={({ color, size }) => <Feather name="home" size={size} color={color} />}
                />
                <DrawerMenuItem
                  onPress={() => toRoute(() => router.push('/scan'))}
                  text="Scan"
                  icon={({ color, size }) => <Feather name="camera" size={size} color={color} />}
                />
                <DrawerMenuItem
                  onPress={() => toRoute(() => router.push('/(tabs)/(stores)'))}
                  text="Stores"
                  icon={({ color, size }) => (
                    <MaterialIcons name="storefront" size={size} color={color} />
                  )}
                />
                <DrawerMenuItem
                  onPress={() => {}}
                  text="My Scan Data"
                  icon={({ color, size }) => (
                    <MaterialCommunityIcons name="barcode-scan" size={size} color={color} />
                  )}
                />
                {isRoleAuthorized(UserRole.Admin, user.role) && (
                  <DrawerMenuItem
                    onPress={() => toRoute(() => router.push('/(tabs)/(admin)/users'))}
                    text="Users"
                    icon={({ color, size }) => <Feather name="users" size={size} color={color} />}
                  />
                )}
              </View>
            </ScrollView>

            <View className="flex flex-col gap-2 border-t-[1px] border-gray-100 px-2 pt-5">
              <DrawerMenuItem
                onPress={() => toRoute(() => router.push('/profile'))}
                text="Profile"
                icon={({ color, size }) => <Feather name="user" size={size} color={color} />}
              />
              <DrawerMenuItem
                onPress={logout}
                text="Log Out"
                icon={({ color, size }) => <Feather name="log-out" size={size} color={color} />}
              />
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    zIndex: 998,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.85,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
