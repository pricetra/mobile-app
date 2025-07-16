import { useLazyQuery } from '@apollo/client';
import * as Network from 'expo-network';
import { useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import Input from '../ui/Input';

import AuthFormContainer from '@/components/auth/ui/AuthFormContainer';
import Btn from '@/components/ui/Btn';
import { AuthModalContext, AuthScreenType } from '@/context/AuthModalContext';
import { JwtStoreContext } from '@/context/JwtStoreContext';
import { LoginInternalDocument } from '@/graphql/types/graphql';
import { getAuthDeviceTypeFromPlatform } from '@/lib/maps';

export default function LoginScreen() {
  const { updateJwt } = useContext(JwtStoreContext);
  const { setScreen, email: screenEmail } = useContext(AuthModalContext);
  const [login, { data, loading, error }] = useLazyQuery(LoginInternalDocument);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!screenEmail) return;
    setEmail(screenEmail);
  }, [screenEmail]);

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

          <Btn
            onPress={() => setScreen(AuthScreenType.REGISTER, email)}
            text="Create new account"
            size="md"
            bgColor="bg-transparent border-[1px] border-gray-400"
            color="text-gray-600"
          />
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

      <View>
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

      {error && <Text className="color-red-700">{error.message}</Text>}

      <Btn
        onPress={async () => {
          const ipAddress = await Network.getIpAddressAsync();
          const device = getAuthDeviceTypeFromPlatform();
          login({
            variables: { email, password, ipAddress, device },
          });
        }}
        disabled={email.trim().length === 0 || password.length === 0}
        loading={loading}
        text="Login"
        size="md"
      />
    </AuthFormContainer>
  );
}
