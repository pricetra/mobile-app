import { useLazyQuery } from '@apollo/client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native';

import Button from '@/components/ui/Button';
import { JWT_KEY } from '@/context/UserContext';
import { LoginInternalDocument } from '@/graphql/types/graphql';
import AuthFormContainer from '@/components/AuthFormContainer';

export default function LoginScreen() {
  const router = useRouter();
  const [login, { data, loading, error }] = useLazyQuery(LoginInternalDocument);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const searchParams = useLocalSearchParams<{ email?: string }>();

  useEffect(() => {
    if (!searchParams.email) return;
    setEmail(searchParams.email);
  }, [searchParams.email]);

  useEffect(() => {
    if (!data) return;

    SecureStore.setItemAsync(JWT_KEY, data.login.token).then(() => router.replace('/(tabs)/'));
  }, [data]);

  return (
    <AuthFormContainer
      title="Login"
      optionalContent={
        <>
          <Text className="text-center font-extrabold text-gray-600">OR</Text>

          <View>
            <Button
              onPress={() => {
                router.push(`/register?email=${email}`);
              }}>
              Create new account
            </Button>
          </View>
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
          login({ variables: { email, password } });
        }}
        loading={loading}
        className="mt-5">
        Login
      </Button>
    </AuthFormContainer>
  );
}
