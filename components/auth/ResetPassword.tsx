import { useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import AuthFormContainer from '@/components/auth/ui/AuthFormContainer';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthModalContext, AuthScreenType } from '@/context/AuthModalContext';
import {
  RequestResetPasswordDocument,
  UpdatePasswordWithResetCodeDocument,
  VerifyPasswordResetCodeDocument,
} from '@/graphql/types/graphql';

const CELL_COUNT = 6;

export default function ResetPassword() {
  const { setScreen, email } = useContext(AuthModalContext);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [
    requestCode,
    { data: requestCodeData, error: requestCodeError, loading: requestCodeLoading },
  ] = useMutation(RequestResetPasswordDocument);
  const [
    verifyResetCode,
    { data: verificationData, error: verificationError, loading: verificationLoading },
  ] = useLazyQuery(VerifyPasswordResetCodeDocument);
  const [resetPassword, { data: resetData, error: resetError, loading: resetting }] = useMutation(
    UpdatePasswordWithResetCodeDocument
  );

  // react-native-confirmation-code-field
  const codeComponentRef = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [codeComponentProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if (email) return;
    Alert.alert('Email required!', 'An email is required to reset your password');
    setScreen(AuthScreenType.LOGIN);
  }, [email]);

  if (!email) throw new Error('email param required');

  useEffect(() => {
    if (!requestCodeError) return;
    Alert.alert('Could not send Reset Email', 'Perhaps the email you entered was incorrect?');
    setScreen(AuthScreenType.LOGIN);
  }, [requestCodeError]);

  useEffect(() => {
    codeComponentRef.current?.focus();

    requestCode({ variables: { email } });
  }, []);

  useEffect(() => {
    if (!resetData?.updatePasswordWithResetCode) return;
    Alert.alert(
      'Password Updated!',
      'Your password updated successfully. Please use the new password to login'
    );
    setScreen(AuthScreenType.LOGIN, email);
  }, [resetData]);

  return (
    <AuthFormContainer
      title="Reset Password"
      optionalContent={
        <>
          <Text className="mt-5 text-center text-gray-600">Didn't receive an email?</Text>

          <Button
            onPress={() => {
              requestCode({ variables: { email } });
            }}
            loading={requestCodeLoading}
            variant="outline">
            Resend Reset Code
          </Button>
        </>
      }>
      {requestCodeLoading ? (
        <View className="flex h-40 items-center justify-center p-10">
          <AntDesign
            name="loading1"
            className="size-[50px] animate-spin text-center"
            color="#374151"
            size={50}
          />
        </View>
      ) : (
        <>
          {!requestCodeError && requestCodeData?.requestPasswordReset && (
            <Text className="text-base color-gray-600">
              Your password reset code was sent to <Text className="font-bold italic">{email}</Text>
            </Text>
          )}

          {!verificationData ? (
            <>
              <CodeField
                ref={codeComponentRef}
                {...codeComponentProps}
                value={code}
                onChangeText={setCode}
                cellCount={CELL_COUNT}
                keyboardType="name-phone-pad"
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

              {verificationError && (
                <Text className="px- color-red-700">{verificationError.message}</Text>
              )}

              <Button
                onPress={() => {
                  verifyResetCode({ variables: { email, code } });
                }}
                loading={verificationLoading}
                disabled={code.length < 6}
                className="mt-1"
                variant="secondary">
                Verify Reset Code
              </Button>
            </>
          ) : (
            <>
              <Input
                onChangeText={setNewPassword}
                value={newPassword}
                placeholder="New Password"
                textContentType="password"
                autoCapitalize="none"
                secureTextEntry
                autoCorrect={false}
                autoComplete="password"
                editable={!resetting}
                label="New Password"
              />

              {resetError && <Text className="px- color-red-700">{resetError.message}</Text>}

              <Button
                onPress={() => {
                  resetPassword({ variables: { email, code, newPassword } });
                }}
                loading={resetting}
                disabled={code.length < 6}
                className="mt-1"
                variant="secondary">
                Update Password
              </Button>
            </>
          )}
        </>
      )}
    </AuthFormContainer>
  );
}
