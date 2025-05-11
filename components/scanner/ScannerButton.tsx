import { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';

export type ScannerButtonProps = {
  children: ReactNode;
  onPress: () => void;
  onLongPress?: () => void;
};

export default function ScannerButton({ children, onPress, onLongPress }: ScannerButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex flex-col items-center justify-center gap-1 rounded-[200px] bg-black/50 p-5">
      {children}
    </TouchableOpacity>
  );
}
