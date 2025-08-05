import { DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';
import { Modal, View } from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

import AuthScreens from '@/components/auth/AuthScreens';
import AppDrawer from '@/components/ui/AppDrawer';
import WelcomeModal from '@/components/welcome/WelcomeModal';
import AuthModalProvider from '@/context/AuthModalContext';
import { DrawerProvider } from '@/context/DrawerContext';
import { HeaderProvider } from '@/context/HeaderContext';
import JwtStoreProvider, { JwtStoreContext } from '@/context/JwtStoreContext';
import LocationContextProvider from '@/context/LocationContext';
import SearchContextProvider from '@/context/SearchContext';
import { UserContextProvider } from '@/context/UserContext';
import ApolloWrapper from '@/graphql/ApolloWrapper';
import { NotificationHandler } from '@/hooks/useNotificationObserver';
import { NAV_THEME } from '@/lib/constants';

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

function RootStack() {
  const { jwt, loading } = useContext(JwtStoreContext);

  useEffect(() => {
    if (loading) return;
    SplashScreen.hideAsync();
  }, [loading]);

  if (loading) return <></>;

  return (
    <>
      <ApolloWrapper>
        <Modal visible={!jwt} animationType="slide" transparent>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <AuthModalProvider>
              <AuthScreens />
            </AuthModalProvider>
          </View>
        </Modal>
      </ApolloWrapper>

      {jwt && (
        <ApolloWrapper jwt={jwt}>
          <UserContextProvider jwt={jwt}>
            <NotificationHandler>
              <DrawerProvider>
                <SearchContextProvider>
                  <AutocompleteDropdownContextProvider>
                    <AppDrawer />
                    <WelcomeModal />
                    <LocationContextProvider>
                      <HeaderProvider>
                        <Stack>
                          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                          <Stack.Screen name="+not-found" />
                        </Stack>
                      </HeaderProvider>
                    </LocationContextProvider>
                  </AutocompleteDropdownContextProvider>
                </SearchContextProvider>
              </DrawerProvider>
            </NotificationHandler>
          </UserContextProvider>
        </ApolloWrapper>
      )}
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <JwtStoreProvider>
      <ThemeProvider value={LIGHT_THEME}>
        <RootStack />
        <StatusBar style="dark" />
        <PortalHost />
      </ThemeProvider>
    </JwtStoreProvider>
  );
}
