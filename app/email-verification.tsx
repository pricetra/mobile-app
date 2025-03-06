import { useMutation } from '@apollo/client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';

import AuthFormContainer, { AuthFormSearchParams } from '@/components/AuthFormContainer';
import { ResendVerificationDocument, VerifyEmailDocument } from '@/graphql/types/graphql';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function EmailVerificationScreen() {
  const router = useRouter();
  const [verifyEmail, { data, loading, error }] = useMutation(VerifyEmailDocument);
  const [
    resendVerification,
    {
      data: resendVerificationData,
      loading: resendVerificationLoading,
      error: resendVerificationError,
    },
  ] = useMutation(ResendVerificationDocument);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');

  const searchParams = useLocalSearchParams<AuthFormSearchParams>();

  useEffect(() => {
    if (!searchParams.email) throw new Error('no verification email provided');
    setEmail(searchParams.email);
  }, [searchParams.email]);

  useEffect(() => {
    if (!data) return;
    router.push(`/login?email=${data.verifyEmail.email}`);
  }, [data]);

  return (
    <AuthFormContainer
      title="Verify your email"
      optionalContent={
        <>
          <Text className="mt-5 text-center text-gray-600">
            Didn't receive a verification code?
          </Text>

          <Button
            onPress={() => {
              resendVerification({ variables: { email } });
            }}
            loading={resendVerificationLoading}>
            Resend code
          </Button>
        </>
      }>
      {searchParams.email && (
        <Text className="text-base color-gray-600">
          A verification code was sent to <Text className="font-bold italic">{email}</Text>
        </Text>
      )}

      <Input
        onChangeText={setCode}
        value={code}
        placeholder="Verification code"
        autoCapitalize="none"
        textContentType="none"
        keyboardType="ascii-capable"
        autoCorrect={false}
        autoComplete="off"
        editable={!loading}
        autoFocus
      />

      {error && <Text className="color-red-700">{error.message}</Text>}

      <Button
        onPress={() => {
          verifyEmail({ variables: { verificationCode: code } });
        }}
        loading={loading}
        className="mt-1">
        Verify email
      </Button>
    </AuthFormContainer>
  );
}
