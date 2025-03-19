import { useMutation } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import AuthFormContainer from '@/components/AuthFormContainer';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthModalContext, AuthScreenType } from '@/context/AuthModalContext';
import { CreateAccountDocument } from '@/graphql/types/graphql';

export default function RegisterScreen() {
  const { setScreen } = useContext(AuthModalContext);
  const [createAccount, { data, loading, error }] = useMutation(CreateAccountDocument);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!data) return;
    setScreen(AuthScreenType.EMAIL_VERIFICATION, email);
  }, [data]);

  return (
    <AuthFormContainer
      title="Create Account"
      optionalContent={
        <>
          <Text className="mt-5 text-center text-gray-600">Already have an account?</Text>

          <View>
            <Button onPress={() => setScreen(AuthScreenType.LOGIN, email)}>Login</Button>
          </View>
        </>
      }>
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
      />

      <Input
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
      />

      <Input
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
      />

      {error && <Text className="color-red-700">{error.message}</Text>}

      <Button
        onPress={() => {
          createAccount({ variables: { email, password, name } });
        }}
        loading={loading}
        className="mt-5">
        Register
      </Button>
    </AuthFormContainer>
  );
}
