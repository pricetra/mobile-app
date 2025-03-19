import { useLazyQuery } from '@apollo/client';
import * as Network from 'expo-network';
import { useContext, useEffect, useState } from 'react';
import { Text } from 'react-native';

import AuthFormContainer from '@/components/AuthFormContainer';
import { Input } from '@/components/ui/Input';
import { AuthModalContext, AuthScreenType } from '@/context/AuthModalContext';
import { JwtStoreContext } from '@/context/JwtStoreContext';
import { LoginInternalDocument } from '@/graphql/types/graphql';
import { getAuthDeviceTypeFromPlatform } from '@/lib/maps';
import Button from '@/components/ui/Button';

export default function LoginScreen() {
  const { updateJwt } = useContext(JwtStoreContext);
  const { setScreen } = useContext(AuthModalContext);
  const [login, { data, loading, error }] = useLazyQuery(LoginInternalDocument);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!data) return;

    const { token, user } = data.login;
    if (!user.active) {
      setScreen(AuthScreenType.EMAIL_VERIFICATION, user.email);
      return;
    }
    updateJwt(token);
  }, [data]);

  return (
    <AuthFormContainer
      title="Login"
      optionalContent={
        <>
          <Text className="mt-5 text-center text-gray-600">Don't have an account?</Text>

          <Button onPress={() => setScreen(AuthScreenType.REGISTER, email)} variant="outline">
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
        label="Email"
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
        label="Password"
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
        className="mt-5"
        variant="secondary">
        Login
      </Button>
    </AuthFormContainer>
  );
}
