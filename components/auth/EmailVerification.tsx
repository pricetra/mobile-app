import { useMutation } from '@apollo/client';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ResendVerificationDocument, VerifyEmailDocument } from 'graphql-utils';
import { Ref, useContext, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import AuthFormContainer from '@/components/auth/ui/AuthFormContainer';
import { AuthModalContext, AuthScreenType } from '@/context/AuthModalContext';

const CELL_COUNT = 6;

export default function EmailVerificationScreen() {
  const { setScreen, email, setEmailVerified } = useContext(AuthModalContext);
  const [verifyEmail, { data, loading: verifyLoading, error: verifyError }] =
    useMutation(VerifyEmailDocument);
  const [
    resendVerification,
    { loading: resendVerificationLoading, error: resendVerificationError },
  ] = useMutation(ResendVerificationDocument);
  const [code, setCode] = useState('');

  // react-native-confirmation-code-field
  const codeComponentRef = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [codeComponentProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  const loading = verifyLoading || resendVerificationLoading;
  const error = verifyError || resendVerificationError;

  useEffect(() => {
    if (!data) return;
    setEmailVerified(true);
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
      description="Almost done, we just need to verify your email"
      buttonLabel="Verify"
      error={error?.message}
      loading={loading}
      disabled={code.length < 6}
      extras={
        <Text className="text-center color-gray-700">
          Didn&apos;t get an email?{' '}
          <Text
            onPress={() => {
              resendVerification({ variables: { email } });
            }}
            className="underline underline-offset-4 color-black">
            Resend verification code
          </Text>
        </Text>
      }
      onPressSubmit={() => {
        verifyEmail({ variables: { verificationCode: code } });
      }}>
      {!error && email && (
        <View className="mb-5 rounded-lg border border-pricetraGreenHeavyDark/50 bg-pricetraGreenHeavyDark/5 px-4 py-3">
          <View className="flex flex-row gap-3">
            <MaterialCommunityIcons name="email-check" size={24} color="#396a12" />

            <View className="flex-1">
              <Text className="text-lg font-semibold color-pricetraGreenHeavyDark">
                Verification email sent!
              </Text>
              <Text className="color-pricetraGreenHeavyDark">
                An email with the verification code was sent to {email}
              </Text>
            </View>
          </View>
        </View>
      )}

      <CodeField
        ref={codeComponentRef as Ref<TextInput>}
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
    </AuthFormContainer>
  );
}
