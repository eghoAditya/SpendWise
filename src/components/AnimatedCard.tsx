import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

const RADIUS = 14;
const STROKE = 2;
const SIZE = 100; // SVG viewBox size
const DURATION = 1200;

// Rectangle perimeter (approx, rounded corners ignored — visually fine)
const PERIMETER = 2 * (SIZE + SIZE - 2 * STROKE);

export default function AnimatedBorderCard({ children, style }: Props) {
  const dashOffset = useSharedValue(PERIMETER);

  const playOnce = () => {
    dashOffset.value = PERIMETER;
    dashOffset.value = withTiming(0, { duration: DURATION });
  };

  useEffect(() => {
    playOnce(); // once on screen load
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  return (
    <Pressable onPress={playOnce} style={style}>
      <View style={styles.wrapper}>
        {/* 🔹 SVG BORDER STROKE */}
        <Svg
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
        >
          <AnimatedRect
            x={STROKE / 2}
            y={STROKE / 2}
            width={SIZE - STROKE}
            height={SIZE - STROKE}
            rx={RADIUS}
            ry={RADIUS}
            fill="none"
            stroke="#d1d5db" // silver
            strokeWidth={STROKE}
            strokeDasharray={PERIMETER}
            animatedProps={animatedProps}
          />
        </Svg>

        {/* CARD CONTENT */}
        <View style={styles.content}>{children}</View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  content: {
    backgroundColor: '#0b1220', 
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
});
