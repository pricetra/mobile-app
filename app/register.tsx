import { useMutation } from '@apollo/client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native';

import AuthFormContainer, { AuthFormSearchParams } from '@/components/AuthFormContainer';
import Button from '@/components/ui/Button';
import { CreateAccountDocument } from '@/graphql/types/graphql';

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
    router.push('/email-verification');
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
        onChangeText={setName}
        value={name}
        placeholder="Full name"
        autoCapitalize="words"
        textContentType="name"
        keyboardType="default"
        autoCorrect
        autoComplete="name"
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
          createAccount({ variables: { email, password, name } });
        }}
        loading={loading}
        className="mt-5">
        Register
      </Button>
    </AuthFormContainer>
  );
}
