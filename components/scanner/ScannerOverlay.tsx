import { useEffect, useRef } from 'react';
import { useWindowDimensions, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';

export default function ScannerOverlay() {
  const { width, height } = useWindowDimensions();
  const overlayColor = 'rgba(0, 0, 0, 0.6)'; // dim background
  const cutoutWidth = width * 0.8;
  const cutoutHeight = cutoutWidth * 0.5;
  const borderRadius = 15;

  const styles = StyleSheet.create({
    scanLine: {
      position: 'absolute',
      left: (width - width * 0.8) / 2 + 5,
      height: 3,
      backgroundColor: 'red',
      borderRadius: 2,
      opacity: 0.9,
    },
  });

  // Animated scan line
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <>
      <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
        <Defs>
          <Mask id="mask">
            {/* Full screen visible area (white = visible) */}
            <Rect x="0" y="0" width={width} height={height} fill="white" />

            {/* Cutout area (black = hidden part of mask) */}
            <Rect
              x={(width - cutoutWidth) / 2}
              y={(height - cutoutHeight) / 2}
              width={cutoutWidth}
              height={cutoutHeight}
              rx={borderRadius}
              ry={borderRadius}
              fill="black"
            />
          </Mask>
        </Defs>

        {/* Semi-transparent overlay that uses the mask */}
        <Rect x="0" y="0" width={width} height={height} fill={overlayColor} mask="url(#mask)" />

        {/* Optional white border around the transparent window */}
        <Rect
          x={(width - cutoutWidth) / 2}
          y={(height - cutoutHeight) / 2}
          width={cutoutWidth}
          height={cutoutHeight}
          rx={borderRadius}
          ry={borderRadius}
          stroke="white"
          strokeWidth={3}
          fill="transparent"
        />
      </Svg>

      <Animated.View
        style={[
          styles.scanLine,
          {
            width: cutoutWidth - 10,
            transform: [
              {
                translateY: Animated.add(
                  animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [(height - cutoutHeight) / 2, (height + cutoutHeight) / 2 - 4],
                  }),
                  0
                ),
              },
            ],
          },
        ]}
      />
    </>
  );
}
