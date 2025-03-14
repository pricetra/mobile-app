import { useLazyQuery } from '@apollo/client';
import * as Network from 'expo-network';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';

import AuthFormContainer, { AuthFormSearchParams } from '@/components/AuthFormContainer';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { JWT_KEY } from '@/context/UserContext';
import { LoginInternalDocument } from '@/graphql/types/graphql';
import { getAuthDeviceTypeFromPlatform } from '@/lib/maps';

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

    const { token, user } = data.login;
    if (!user.active) {
      router.push(`/email-verification?email=${user.email}&name=${user.name}`);
      return;
    }
    SecureStore.setItemAsync(JWT_KEY, token).then(() => {
      router.replace('/(tabs)/');
    });
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
      />

      <Input
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
        onPress={async () => {
          const ipAddress = await Network.getIpAddressAsync();
          const device = getAuthDeviceTypeFromPlatform();
          login({
            variables: { email, password, ipAddress, device },
          });
        }}
        loading={loading}
        className="mt-5">
        Login
      </Button>
    </AuthFormContainer>
  );
}
