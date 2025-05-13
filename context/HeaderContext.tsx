import { createContext, ReactNode, useContext, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type HeaderSectionStateType = (
  color?: string,
  size?: number,
  styles?: StyleProp<ViewStyle>
) => ReactNode;

export type HeaderContextType = {
  leftSection?: HeaderSectionStateType;
  middleSection?: HeaderSectionStateType;
  rightSection?: HeaderSectionStateType;
  subHeader?: HeaderSectionStateType;

  setLeftSection: (value: HeaderSectionStateType) => void;
  setMiddleSection: (value: HeaderSectionStateType) => void;
  setRightSection: (value: HeaderSectionStateType) => void;
  setSubHeader: (value: HeaderSectionStateType) => void;
};

const HeaderContext = createContext<HeaderContextType>({} as HeaderContextType);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [leftSection, setLeftSection] = useState<HeaderSectionStateType>();
  const [middleSection, setMiddleSection] = useState<HeaderSectionStateType>();
  const [rightSection, setRightSection] = useState<HeaderSectionStateType>();
  const [subHeader, setSubHeader] = useState<HeaderSectionStateType>();

  return (
    <HeaderContext.Provider
      value={{
        leftSection,
        middleSection,
        rightSection,
        subHeader,
        setLeftSection,
        setMiddleSection,
        setRightSection,
        setSubHeader,
      }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);
