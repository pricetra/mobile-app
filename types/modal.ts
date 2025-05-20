import { ReactNode } from 'react';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';

export type ModalProps = {
  visible: boolean;
  onRequestClose: (event: NativeSyntheticEvent<any>) => void;
  children: ReactNode;
  title: string;
  TitleComponent?: ReactNode;
  className?: string;
};
