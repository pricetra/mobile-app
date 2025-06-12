import { DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
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
import AuthModalProvider from '@/context/AuthModalContext';
import { DrawerProvider } from '@/context/DrawerContext';
import { HeaderProvider } from '@/context/HeaderContext';
import JwtStoreProvider, { JwtStoreContext } from '@/context/JwtStoreContext';
import SearchContextProvider from '@/context/SearchContext';
import { UserContextProvider } from '@/context/UserContext';
import ApolloWrapper from '@/graphql/ApolloWrapper';
import { NAV_THEME } from '@/lib/constants';
import WelcomeModal from '@/components/welcome/WelcomeModal';

dayjs.extend(relativeTime);

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
      <Modal visible={!jwt} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <AuthModalProvider>
            <AuthScreens />
          </AuthModalProvider>
        </View>
      </Modal>

      {jwt && (
        <UserContextProvider jwt={jwt}>
          <DrawerProvider>
            <SearchContextProvider>
              <AutocompleteDropdownContextProvider>
                <AppDrawer />

                <WelcomeModal />

                <HeaderProvider>
                  <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </HeaderProvider>
              </AutocompleteDropdownContextProvider>
            </SearchContextProvider>
          </DrawerProvider>
        </UserContextProvider>
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
      <ApolloWrapper>
        <ThemeProvider value={LIGHT_THEME}>
          <RootStack />
          <StatusBar style="dark" />
          <PortalHost />
        </ThemeProvider>
      </ApolloWrapper>
    </JwtStoreProvider>
  );
}
