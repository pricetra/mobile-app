import { createContext, ReactNode, useContext, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type HeaderSectionStateType = (
  color?: string,
  size?: number,
  styles?: StyleProp<ViewStyle>
) => ReactNode;

export type HeaderContextType = {
  subHeader?: ReactNode;
  setSubHeader: (elem?: ReactNode) => void;
};

const HeaderContext = createContext<HeaderContextType>({} as HeaderContextType);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [subHeader, setSubHeader] = useState<ReactNode>();

  return (
    <HeaderContext.Provider
      value={{
        subHeader,
        setSubHeader,
      }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);
