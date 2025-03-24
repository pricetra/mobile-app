import { DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';
import { Modal } from 'react-native';

import AuthScreens from '@/components/auth/AuthScreens';
import AuthModalProvider from '@/context/AuthModalContext';
import JwtStoreProvider, { JwtStoreContext } from '@/context/JwtStoreContext';
import SearchContextProvider from '@/context/SearchContext';
import { UserContextProvider } from '@/context/UserContext';
import ApolloWrapper from '@/graphql/ApolloWrapper';
import { NAV_THEME } from '@/lib/constants';

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
      <Modal visible={!jwt} animationType="slide">
        <AuthModalProvider>
          <AuthScreens />
        </AuthModalProvider>
      </Modal>

      {jwt && (
        <UserContextProvider jwt={jwt}>
          <SearchContextProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </SearchContextProvider>
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
          <StatusBar style="light" />
          <PortalHost />
        </ThemeProvider>
      </ApolloWrapper>
    </JwtStoreProvider>
  );
}
