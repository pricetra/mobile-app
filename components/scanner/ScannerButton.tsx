import { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';

export type ScannerButtonProps = {
  children: ReactNode;
  onPress: () => void;
};

export default function ScannerButton({ children, onPress }: ScannerButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col items-center justify-center gap-1 rounded-[200px] bg-black/50 p-5">
      {children}
    </TouchableOpacity>
  );
}
