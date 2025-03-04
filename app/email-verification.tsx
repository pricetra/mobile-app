import { useMutation } from '@apollo/client';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';

import AuthFormContainer from '@/components/AuthFormContainer';
import Button from '@/components/ui/Button';
import { VerifyEmailDocument } from '@/graphql/types/graphql';

export default function EmailVerificationScreen() {
  const router = useRouter();
  const [verifyEmail, { data, loading, error }] = useMutation(VerifyEmailDocument);
  const [code, setCode] = useState('');

  useEffect(() => {
    if (!data) return;
    router.push(`/login?email=${data.verifyEmail.email}`);
  }, [data]);

  return (
    <AuthFormContainer title="Verify email">
      <TextInput
        onChangeText={setCode}
        value={code}
        placeholder="Full name"
        autoCapitalize="words"
        textContentType="name"
        keyboardType="ascii-capable"
        autoCorrect={false}
        autoComplete="off"
        editable={!loading}
        className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-lg placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400"
      />

      {error && <Text className="color-red-700">{error.message}</Text>}

      <Button
        onPress={() => {
          verifyEmail({ variables: { verificationCode: code } });
        }}
        loading={loading}
        className="mt-5">
        Submit
      </Button>
    </AuthFormContainer>
  );
}
