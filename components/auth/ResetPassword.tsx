import { useLazyQuery, useMutation } from '@apollo/client';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import Input from '../ui/Input';

import AuthFormContainer from '@/components/auth/ui/AuthFormContainer';
import Btn from '@/components/ui/Btn';
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

  const loading = requestCodeLoading || verificationLoading || resetting;
  const error = requestCodeError || verificationError || resetError;

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
      buttonLabel={!verificationData ? 'Verify Reset Code' : 'Update Password'}
      error={error?.message}
      loading={loading}
      disabled={code.length < 6}
      extras={
        <Text className="text-center color-gray-700">
          Didn&apos;t get an email?{' '}
          <Text
            onPress={() => {
              requestCode({ variables: { email } });
            }}
            className="underline underline-offset-4 color-black">
            Resend reset code
          </Text>
        </Text>
      }
      onPressSubmit={
        !verificationData
          ? () => verifyResetCode({ variables: { email, code } })
          : () => resetPassword({ variables: { email, code, newPassword } })
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
            <View className="mb-5 rounded-lg border border-pricetraGreenHeavyDark/50 bg-pricetraGreenHeavyDark/5 px-4 py-3">
              <View className="flex flex-row gap-3">
                <MaterialCommunityIcons name="email-check" size={24} color="#396a12" />

                <View className="flex-1">
                  <Text className="text-lg font-semibold color-pricetraGreenHeavyDark">
                    Password reset email sent!
                  </Text>
                  <Text className="color-pricetraGreenHeavyDark">
                    Your password reset code was sent to{' '}
                    <Text className="font-bold italic">{email}</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          {!verificationData ? (
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
          ) : (
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
          )}
        </>
      )}
    </AuthFormContainer>
  );
}
