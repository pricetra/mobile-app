import { useMutation } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { Text } from 'react-native';

import AuthFormContainer from '@/components/AuthFormContainer';
import { Input } from '@/components/ui/Input';
import { AuthModalContext, AuthScreenType } from '@/context/AuthModalContext';
import { ResendVerificationDocument, VerifyEmailDocument } from '@/graphql/types/graphql';
import Button from '@/components/ui/Button';

export default function EmailVerificationScreen() {
  const { setScreen, email } = useContext(AuthModalContext);
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

  useEffect(() => {
    if (!data) return;
    setScreen(AuthScreenType.LOGIN, data.verifyEmail.email);
  }, [data]);

  if (!email) throw new Error('email param required');

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
            loading={resendVerificationLoading}
            variant="outline">
            Resend code
          </Button>
        </>
      }>
      {resendVerificationData && (
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
        className="mt-1"
        variant="secondary">
        Verify email
      </Button>
    </AuthFormContainer>
  );
}
