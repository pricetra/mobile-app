import { Platform, Text, TextProps } from 'react-native';

export type BarcodeTextProps = TextProps;

export default function BarcodeText({ children, ...props }: BarcodeTextProps) {
  return (
    <Text
      style={{
        fontVariant: ['tabular-nums'],
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        letterSpacing: 2,
      }}
      {...props}>
      {children}
    </Text>
  );
}
