import { createContext, ReactNode, useState } from 'react';

export enum AuthScreenType {
  LOGIN,
  REGISTER,
  EMAIL_VERIFICATION,
}

export type AuthModal = {
  screen: AuthScreenType;
  email?: string;
  setScreen: (newScreen: AuthScreenType, email?: string) => void;
};

export const AuthModalContext = createContext({} as AuthModal);

export type AuthModalProviderProps = {
  children: ReactNode;
};

export default function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [screen, setScreen] = useState(AuthScreenType.LOGIN);
  const [email, setEmail] = useState<string>();

  return (
    <AuthModalContext.Provider
      value={{
        screen,
        email,
        setScreen: (newScreen, email) => {
          setEmail(email);
          setScreen(newScreen);
        },
      }}>
      {children}
    </AuthModalContext.Provider>
  );
}
