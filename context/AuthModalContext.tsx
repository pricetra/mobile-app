import { createContext, ReactNode, useState } from 'react';

export enum AuthScreenType {
  LOGIN,
  REGISTER,
  EMAIL_VERIFICATION,
  RESET_PASSWORD,
}

export type AuthModal = {
  screen: AuthScreenType;
  email?: string;
  emailVerified?: boolean;
  setEmailVerified: (v?: boolean) => void;
  setScreen: (newScreen: AuthScreenType, email?: string) => void;
};

export const AuthModalContext = createContext({} as AuthModal);

export type AuthModalProviderProps = {
  children: ReactNode;
};

export default function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [screen, setScreen] = useState(AuthScreenType.LOGIN);
  const [email, setEmail] = useState<string>();
  const [emailVerified, setEmailVerified] = useState<boolean>();

  return (
    <AuthModalContext.Provider
      value={{
        screen,
        email,
        emailVerified,
        setScreen: (newScreen, email) => {
          setEmail(email);
          setScreen(newScreen);
        },
        setEmailVerified,
      }}>
      {children}
    </AuthModalContext.Provider>
  );
}
