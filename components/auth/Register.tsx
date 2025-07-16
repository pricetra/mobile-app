import { useMutation } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import Input from '../ui/Input';

import AuthFormContainer from '@/components/auth/ui/AuthFormContainer';
import Btn from '@/components/ui/Btn';
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

          <Btn
            onPress={() => setScreen(AuthScreenType.LOGIN, email)}
            text="Login"
            size="sm"
            bgColor="bg-transparent border-[1px] border-gray-400"
            color="text-gray-600"
          />
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

      <View className="mt-7">
        <Btn
          onPress={() => {
            createAccount({ variables: { email, password, name } });
          }}
          disabled={email.trim().length === 0 || name.trim().length === 0 || password.length === 0}
          loading={loading}
          text="Create account"
          size="md"
        />
      </View>
    </AuthFormContainer>
  );
}
