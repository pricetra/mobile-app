import { useLazyQuery } from '@apollo/client';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Network from 'expo-network';
import { GoogleOAuthDocument, LoginInternalDocument } from 'graphql-utils';
import { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Input from '../ui/Input';

import AuthFormContainer from '@/components/auth/ui/AuthFormContainer';
import { AuthModalContext, AuthScreenType } from '@/context/AuthModalContext';
import { JwtStoreContext } from '@/context/JwtStoreContext';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { getAuthDeviceTypeFromPlatform } from '@/lib/maps';

export default function LoginScreen() {
  const { updateJwt } = useContext(JwtStoreContext);
  const { setScreen, email: screenEmail, emailVerified } = useContext(AuthModalContext);
  const [login, { data, loading, error }] = useLazyQuery(LoginInternalDocument, {
    fetchPolicy: 'no-cache',
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    signIn: startGoogleAuth,
    loading: googleAuthLoading,
    accessToken: googleAccessToken,
  } = useGoogleAuth();
  const [googleOauth, { loading: googleOauthLoading }] = useLazyQuery(GoogleOAuthDocument, {
    fetchPolicy: 'no-cache',
  });
  const googleAuthInProgress = googleAuthLoading || googleOauthLoading;

  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!screenEmail) return;
    setEmail(screenEmail);
  }, [screenEmail]);

  useEffect(() => {
    if (!data) return;

    const { token, user } = data.login;
    if (!user.active) {
      setScreen(AuthScreenType.EMAIL_VERIFICATION, user.email);
      return;
    }
    updateJwt(token);
  }, [data]);

  useEffect(() => {
    if (!googleAccessToken) return;

    googleOauth({
      variables: {
        accessToken: googleAccessToken,
      },
    })
      .then(({ data }) => {
        if (!data) return;
        updateJwt(data.googleOAuth.token);
      })
      .catch((err) => Alert.alert('Could not complete Google OAuth', err));
  }, [googleAccessToken]);

  async function onLogin() {
    const ipAddress = await Network.getIpAddressAsync();
    const device = getAuthDeviceTypeFromPlatform();
    login({
      variables: { email, password, ipAddress, device },
    });
  }

  return (
    <AuthFormContainer
      title="Welcome back"
      buttonLabel="Login"
      description="Login to your Pricetra account"
      extras={
        <Text className="text-center color-gray-500">
          Don&apos;t have an account?{' '}
          <Text
            onPress={() => setScreen(AuthScreenType.REGISTER, email)}
            className="underline underline-offset-4 color-black">
            Sign up
          </Text>
        </Text>
      }
      error={error?.message}
      loading={loading}
      disabled={email.trim().length === 0 || password.length === 0}
      onPressApple={() =>
        Alert.alert(
          'Login method not implemented',
          'Sign in with Apple is currently not available on the mobile app'
        )
      }
      googleLoading={googleAuthInProgress}
      onPressGoogle={startGoogleAuth}
      onPressSubmit={onLogin}>
      {!error && emailVerified && (
        <View className="rounded-lg border border-pricetraGreenHeavyDark/50 bg-pricetraGreenHeavyDark/5 px-4 py-3">
          <View className="flex flex-row gap-3">
            <MaterialCommunityIcons name="email-check" size={24} color="#396a12" />

            <View className="flex-1">
              <Text className="text-lg font-semibold color-pricetraGreenHeavyDark">
                Email verified!
              </Text>
              <Text className="color-pricetraGreenHeavyDark">
                Your email address was successfully verified. Please login to continue
              </Text>
            </View>
          </View>
        </View>
      )}

      <Input
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        autoCapitalize="none"
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCorrect
        autoComplete="email"
        editable={!loading}
        label="Email"
        onSubmitEditing={() => passwordInputRef.current?.focus()}
      />

      <View>
        <Input
          ref={passwordInputRef}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          textContentType="password"
          autoCapitalize="none"
          secureTextEntry
          autoCorrect={false}
          autoComplete="password"
          editable={!loading}
          label="Password"
          onSubmitEditing={() => onLogin()}
        />

        <View className="mt-3 flex h-[20px] flex-row">
          <View className="flex-1" />

          {email && (
            <TouchableOpacity onPress={() => setScreen(AuthScreenType.RESET_PASSWORD, email)}>
              <Text className="text-right text-sm color-pricetraGreenHeavyDark">
                Forgot password?
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </AuthFormContainer>
  );
}
