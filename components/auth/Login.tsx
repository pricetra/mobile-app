import { useLazyQuery } from '@apollo/client';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Network from 'expo-network';
import { AppleOAuthDocument, GoogleOAuthDocument, LoginInternalDocument } from 'graphql-utils';
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
  const [login, { loading: internalLoginLoading, error: internalLoginError }] = useLazyQuery(
    LoginInternalDocument,
    {
      fetchPolicy: 'no-cache',
    }
  );
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
  const [appleOauth, { loading: appleOauthLoading }] = useLazyQuery(AppleOAuthDocument, {
    fetchPolicy: 'no-cache',
  });
  const googleAuthInProgress = googleAuthLoading || googleOauthLoading;

  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!screenEmail) return;
    setEmail(screenEmail);
  }, [screenEmail]);

  useEffect(() => {
    if (!googleAccessToken) return;

    Network.getIpAddressAsync().then((ipAddress) => {
      const device = getAuthDeviceTypeFromPlatform();
      googleOauth({
        variables: {
          accessToken: googleAccessToken,
          ipAddress,
          device,
        },
      })
        .then(({ data, error }) => {
          if (error) {
            Alert.alert('Could not complete Google OAuth', error.message);
            return;
          }
          if (!data) return;

          updateJwt(data.googleOAuth.token);
        })
        .catch((err) => Alert.alert('Could not complete Google OAuth', err));
    });
  }, [googleAccessToken]);

  async function onLogin() {
    const ipAddress = await Network.getIpAddressAsync();
    const device = getAuthDeviceTypeFromPlatform();
    login({
      variables: { email, password, ipAddress, device },
    }).then(({ data }) => {
      if (!data) return;

      const { user, token } = data.login;
      if (!user.active) {
        setScreen(AuthScreenType.EMAIL_VERIFICATION, user.email);
        return;
      }
      updateJwt(token);
    });
  }

  async function onGoogleLogin() {
    startGoogleAuth();
  }

  async function onAppleLogin() {
    const isAppleAuthCompatible = await AppleAuthentication.isAvailableAsync();
    if (!isAppleAuthCompatible) {
      Alert.alert(
        'Sign in with Apple is not supported',
        'Your device does not support Apple OAuth. Please try a different authentication method.'
      );
      return;
    }

    AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    }).then(async ({ identityToken, ...appleExtras }) => {
      let appleRawUser: string | undefined = undefined;
      if (appleExtras.fullName) {
        appleRawUser = JSON.stringify({
          name: {
            firstName: appleExtras.fullName.givenName,
            lastName: appleExtras.fullName.familyName,
          },
          email: appleExtras.email,
        });
      }

      if (!identityToken) {
        Alert.alert('Apple identity token not found');
        return;
      }

      const ipAddress = await Network.getIpAddressAsync();
      const device = getAuthDeviceTypeFromPlatform();
      const { data, error } = await appleOauth({
        variables: {
          code: identityToken,
          appleRawUser,
          ipAddress,
          device,
        },
      });
      if (error) {
        Alert.alert('Could not complete Apple OAuth', error.message);
        return;
      }
      if (!data) return;

      updateJwt(data.appleOAuth.token);
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
      error={internalLoginError?.message}
      loading={internalLoginLoading}
      disabled={email.trim().length === 0 || password.length === 0}
      onPressApple={onAppleLogin}
      appleLoading={appleOauthLoading}
      googleLoading={googleAuthInProgress}
      onPressGoogle={onGoogleLogin}
      onPressSubmit={onLogin}>
      {!internalLoginError && emailVerified && (
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
        editable={!internalLoginLoading}
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
          editable={!internalLoginLoading}
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
