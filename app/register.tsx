import { useMutation } from '@apollo/client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import AuthFormContainer, { AuthFormSearchParams } from '@/components/AuthFormContainer';
import Button from '@/components/ui/Button';
import { CreateAccountDocument } from '@/graphql/types/graphql';
import { Input } from '@/components/ui/Input';

export default function RegisterScreen() {
  const router = useRouter();
  const [createAccount, { data, loading, error }] = useMutation(CreateAccountDocument);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const searchParams = useLocalSearchParams<AuthFormSearchParams>();

  useEffect(() => {
    if (!searchParams.email) return;
    setEmail(searchParams.email);
  }, [searchParams.email]);

  useEffect(() => {
    if (!data) return;
    router.push(`/email-verification?email=${email}&name=${name}`);
  }, [data]);

  return (
    <AuthFormContainer
      title="Create Account"
      optionalContent={
        <>
          <Text className="mt-5 text-center text-gray-600">Already have an account?</Text>

          <View>
            <Button
              onPress={() => {
                router.push(`/login?email=${email}`);
              }}>
              Login
            </Button>
          </View>
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
