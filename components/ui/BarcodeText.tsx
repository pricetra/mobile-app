import { Platform, Text, TextProps } from 'react-native';

export type BarcodeTextProps = TextProps & {
  letterSpacing?: number;
};

export default function BarcodeText({ children, letterSpacing = 2, ...props }: BarcodeTextProps) {
  return (
    <Text
      style={{
        fontVariant: ['tabular-nums'],
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        letterSpacing,
      }}
      {...props}>
      {children}
    </Text>
  );
}
