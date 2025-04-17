import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useDrawer } from '@/context/DrawerContext';
import { useContext, useEffect, useRef } from 'react';
import { Feather } from '@expo/vector-icons';
import ProfileSmall from '../profile/ProfileSmall';
import { UserAuthContext } from '@/context/UserContext';

const { width, height } = Dimensions.get('window');

export default function AppDrawer() {
  const {user, logout} = useContext(UserAuthContext)
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
        <SafeAreaView>
          <View className="flex flex-row items-center justify-between gap-3 border-b-[1px] border-gray-100">
            <View className="flex-1 p-5 text-2xl font-bold">
              <ProfileSmall user={user} />
            </View>

            <TouchableOpacity
              onPress={closeDrawer}
              className="flex items-center justify-center p-5 bg-white">
              <Feather name="x" size={25} />
            </TouchableOpacity>
          </View>
          <View className="mt-5 p-5">
            <Pressable onPress={() => console.log('Navigate to Settings')}>
              <Text style={styles.link}>Settings</Text>
            </Pressable>
            <Pressable onPress={() => logout()}>
              <Text style={styles.link}>Logout</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'black',
    zIndex: 998,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  menu: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  link: {
    fontSize: 16,
    marginVertical: 10,
  },
});
