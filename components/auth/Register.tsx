import { useLazyQuery, useMutation } from '@apollo/client';
import { CreateAccountDocument, GoogleOAuthDocument } from 'graphql-utils';
import { useContext, useEffect, useRef, useState } from 'react';
import { Text, Alert, TextInput } from 'react-native';

import Input from '../ui/Input';

import AuthFormContainer from '@/components/auth/ui/AuthFormContainer';
import { AuthModalContext, AuthScreenType } from '@/context/AuthModalContext';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { JwtStoreContext } from '@/context/JwtStoreContext';

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
      onPressApple={() =>
        Alert.alert(
          'Login method not implemented',
          'Sign in with Apple is currently not available on the mobile app'
        )
      }
      googleLoading={googleAuthInProgress}
      onPressGoogle={startGoogleAuth}
      onPressSubmit={onSignUp}>
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
