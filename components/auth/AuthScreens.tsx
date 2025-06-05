import { useContext } from 'react';

import EmailVerificationScreen from './EmailVerification';
import LoginScreen from './Login';
import RegisterScreen from './Register';
import ResetPassword from './ResetPassword';

import { AuthModalContext, AuthScreenType } from '@/context/AuthModalContext';

export default function AuthScreens() {
  const { screen } = useContext(AuthModalContext);

  switch (screen) {
    case AuthScreenType.LOGIN:
      return <LoginScreen />;
    case AuthScreenType.EMAIL_VERIFICATION:
      return <EmailVerificationScreen />;
    case AuthScreenType.REGISTER:
      return <RegisterScreen />;
    case AuthScreenType.RESET_PASSWORD:
      return <ResetPassword />;
    default:
      return <LoginScreen />;
  }
}
