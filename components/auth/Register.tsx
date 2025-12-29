import { useLazyQuery, useMutation } from '@apollo/client';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Network from 'expo-network';
import { AppleOAuthDocument, CreateAccountDocument, GoogleOAuthDocument } from 'graphql-utils';
import { useContext, useEffect, useRef, useState } from 'react';
import { Text, Alert, TextInput } from 'react-native';

import Input from '../ui/Input';

import AuthFormContainer from '@/components/auth/ui/AuthFormContainer';
import { AuthModalContext, AuthScreenType } from '@/context/AuthModalContext';
import { JwtStoreContext } from '@/context/JwtStoreContext';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { getAuthDeviceTypeFromPlatform } from '@/lib/maps';

export default function RegisterScreen() {
  const { updateJwt } = useContext(JwtStoreContext);
  const { setScreen } = useContext(AuthModalContext);
  const [createAccount, { data, loading, error }] = useMutation(CreateAccountDocument);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
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

  const [appleOauth, { loading: appleOauthLoading }] = useLazyQuery(AppleOAuthDocument, {
    fetchPolicy: 'no-cache',
  });

  const fullNameInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!data) return;
    setScreen(AuthScreenType.EMAIL_VERIFICATION, email);
  }, [data]);

  async function onSignUp() {
    createAccount({ variables: { email, password, name } });
  }

  useEffect(() => {
    if (!googleAccessToken) return;

    const device = getAuthDeviceTypeFromPlatform();
    Network.getIpAddressAsync().then((ipAddress) => {
      googleOauth({
        variables: {
          accessToken: googleAccessToken,
          ipAddress,
          device,
        },
      })
        .then(({ data }) => {
          if (!data) return;
          updateJwt(data.googleOAuth.token);
        })
        .catch((err) => Alert.alert('Could not complete Google OAuth', err));
    });
  }, [googleAccessToken]);

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
      title="Create your account"
      description="Sign up and start saving today"
      buttonLabel="Sign Up"
      extras={
        <Text className="text-center color-gray-500">
          Already have an account?{' '}
          <Text
            onPress={() => setScreen(AuthScreenType.LOGIN, email)}
            className="underline underline-offset-4 color-black">
            Login
          </Text>
        </Text>
      }
      error={error?.message}
      loading={loading}
      disabled={email.trim().length === 0 || name.trim().length === 0 || password.length === 0}
      onPressSubmit={onSignUp}
      onPressGoogle={startGoogleAuth}
      googleLoading={googleAuthInProgress}
      onPressApple={onAppleLogin}
      appleLoading={appleOauthLoading}>
      <Input
        label="Email"
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        autoCapitalize="none"
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCorrect
        autoComplete="email"
        editable={!loading}
        onSubmitEditing={() => fullNameInputRef.current?.focus()}
      />

      <Input
        ref={fullNameInputRef}
        label="Full Name"
        onChangeText={setName}
        value={name}
        placeholder="Full name"
        autoCapitalize="words"
        textContentType="name"
        keyboardType="default"
        autoCorrect
        autoComplete="name"
        editable={!loading}
        onSubmitEditing={() => passwordInputRef.current?.focus()}
      />

      <Input
        ref={passwordInputRef}
        label="Password"
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        textContentType="password"
        autoCapitalize="none"
        secureTextEntry
        autoCorrect={false}
        autoComplete="password"
        editable={!loading}
        onSubmitEditing={() => onSignUp()}
      />
    </AuthFormContainer>
  );
}
