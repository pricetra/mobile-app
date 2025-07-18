import { useMutation } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import AuthFormContainer from '@/components/auth/ui/AuthFormContainer';
import Btn from '@/components/ui/Btn';
import { AuthModalContext, AuthScreenType } from '@/context/AuthModalContext';
import { ResendVerificationDocument, VerifyEmailDocument } from '@/graphql/types/graphql';

const CELL_COUNT = 6;

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

  // react-native-confirmation-code-field
  const codeComponentRef = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [codeComponentProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if (!data) return;
    setScreen(AuthScreenType.LOGIN, email);
  }, [data]);

  if (!email) throw new Error('email param required');

  useEffect(() => {
    codeComponentRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!resendVerificationError) return;
    alert(resendVerificationError.message);
  }, [resendVerificationError]);

  return (
    <AuthFormContainer
      title="Verify your email"
      optionalContent={
        <>
          <Text className="mt-5 text-center text-gray-600">
            Didn't receive a verification code?
          </Text>

          <Btn
            onPress={() => {
              resendVerification({ variables: { email } });
            }}
            loading={resendVerificationLoading}
            text="Resend code"
            size="md"
            bgColor="bg-transparent border-[1px] border-gray-400"
            color="text-gray-600"
            iconColor="black"
          />
        </>
      }>
      {resendVerificationData && (
        <Text className="text-base color-gray-600">
          A verification code was sent to <Text className="font-bold italic">{email}</Text>
        </Text>
      )}

      <CodeField
        ref={codeComponentRef}
        {...codeComponentProps}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            className="size-10 rounded-lg border-2 border-gray-200 text-center text-2xl font-bold"
            style={[
              isFocused && {
                borderColor: '#000',
              },
            ]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />

      {error && <Text className="px- color-red-700">{error.message}</Text>}

      <View className="mt-5">
        <Btn
          onPress={() => {
            verifyEmail({ variables: { verificationCode: code } });
          }}
          loading={loading}
          disabled={code.length < 6}
          text="Verify email"
        />
      </View>
    </AuthFormContainer>
  );
}
