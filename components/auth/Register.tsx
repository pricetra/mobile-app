import { useMutation } from '@apollo/client';
import { useContext, useEffect, useRef, useState } from 'react';
import { Text, Alert, TextInput } from 'react-native';

import Input from '../ui/Input';

import AuthFormContainer from '@/components/auth/ui/AuthFormContainer';
import { AuthModalContext, AuthScreenType } from '@/context/AuthModalContext';
import { CreateAccountDocument } from '@/graphql/types/graphql';

export default function RegisterScreen() {
  const { setScreen } = useContext(AuthModalContext);
  const [createAccount, { data, loading, error }] = useMutation(CreateAccountDocument);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const fullNameInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!data) return;
    setScreen(AuthScreenType.EMAIL_VERIFICATION, email);
  }, [data]);

  async function onSignUp() {
    createAccount({ variables: { email, password, name } });
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
      onPressApple={() =>
        Alert.alert(
          'Login method not implemented',
          'Sign in with Apple is currently not available on the mobile app'
        )
      }
      onPressGoogle={() =>
        Alert.alert(
          'Login method not implemented',
          'Sign in with Google is currently not available on the mobile app'
        )
      }
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
        onEndEditing={() => fullNameInputRef.current?.focus()}
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
        onEndEditing={() => passwordInputRef.current?.focus()}
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
        onEndEditing={() => onSignUp()}
      />
    </AuthFormContainer>
  );
}
