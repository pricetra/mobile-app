import { useLazyQuery } from '@apollo/client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native';

import AuthFormContainer, { AuthFormSearchParams } from '@/components/AuthFormContainer';
import Button from '@/components/ui/Button';
import { JWT_KEY } from '@/context/UserContext';
import { LoginInternalDocument } from '@/graphql/types/graphql';

export default function LoginScreen() {
  const router = useRouter();
  const [login, { data, loading, error }] = useLazyQuery(LoginInternalDocument);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const searchParams = useLocalSearchParams<AuthFormSearchParams>();

  useEffect(() => {
    if (!searchParams.email) return;
    setEmail(searchParams.email);
  }, [searchParams.email]);

  useEffect(() => {
    if (!data) return;

    console.log(data);
    const { token, user } = data.login;
    if (!user.active) {
      router.push(`/email-verification?email=${user.email}&name=${user.name}`);
      return;
    }
    SecureStore.setItemAsync(JWT_KEY, token).then(() => router.replace('/(tabs)/'));
  }, [data]);

  return (
    <AuthFormContainer
      title="Login"
      optionalContent={
        <>
          <Text className="mt-5 text-center text-gray-600">Don't have an account?</Text>

          <Button
            onPress={() => {
              router.push(`/register?email=${email}`);
            }}>
            Create new account
          </Button>
        </>
      }>
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        autoCapitalize="none"
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCorrect
        autoComplete="email"
        editable={!loading}
        className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-lg placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400"
      />

      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        textContentType="password"
        autoCapitalize="none"
        secureTextEntry
        autoCorrect={false}
        autoComplete="password"
        editable={!loading}
        className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-lg placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400"
      />

      {error && <Text className="color-red-700">{error.message}</Text>}

      <Button
        onPress={() => {
          console.log('login button pressed');
          login({ variables: { email, password } });
        }}
        loading={loading}
        className="mt-5">
        Login
      </Button>
    </AuthFormContainer>
  );
}
