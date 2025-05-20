import { createContext, ReactNode, useContext, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type HeaderSectionStateType = (
  color?: string,
  size?: number,
  styles?: StyleProp<ViewStyle>
) => ReactNode;

export type HeaderContextType = {
  subHeader?: ReactNode;
  rightNav?: ReactNode;
  setSubHeader: (elem?: ReactNode) => void;
  setRightNav: (elem?: ReactNode) => void;
};

const HeaderContext = createContext<HeaderContextType>({} as HeaderContextType);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [subHeader, setSubHeader] = useState<ReactNode>();
  const [rightNav, setRightNav] = useState<ReactNode>();

  return (
    <HeaderContext.Provider
      value={{
        subHeader,
        rightNav,
        setSubHeader,
        setRightNav,
      }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);
