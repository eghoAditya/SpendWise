import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path } from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);

type Slice = {
  value: number;
  color: string;
};

type Props = {
  size?: number;
  thickness?: number;
  data: Slice[];
  onSpinEnd?: () => void;
};

export function DonutPieChart({
  size = 190,
  thickness = 44,
  data,
  onSpinEnd,
}: Props) {
  const rotation = useSharedValue(0);
  const radius = size / 2;
  const innerRadius = radius - thickness;

  const total = data.reduce((s, d) => s + d.value, 0);

  const spin = () => {
    rotation.value = -90; // visible starting offset
  
    rotation.value = withTiming(
      450, // >360 so eye can track motion
      {
        duration: 1200,
        easing: Easing.out(Easing.cubic),
      },
      () => {
        onSpinEnd && runOnJS(onSpinEnd)();
      }
    );
  };
  

  useEffect(() => {
    spin();
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    rotation: rotation.value,
    originX: radius,
    originY: radius,
  }));

  let startAngle = -Math.PI / 2;

  const arcs = data.map((slice, index) => {
    const angle = (slice.value / total) * Math.PI * 2;
    const endAngle = startAngle + angle;
    const largeArc = angle > Math.PI ? 1 : 0;

    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);

    const d = `
      M ${radius} ${radius}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;

    startAngle = endAngle;

    return <Path key={index} d={d} fill={slice.color} />;
  });

  return (
    <Pressable onPress={spin}>
      <View>
        <Svg width={size} height={size}>
          {/* depth ring */}
          <Circle
            cx={radius}
            cy={radius}
            r={radius}
            fill="rgba(0,0,0,0.35)"
          />

          <AnimatedG animatedProps={animatedProps}>
            {arcs}
          </AnimatedG>

          {/* donut hole */}
          <Circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            fill="#020617"
          />
        </Svg>
      </View>
    </Pressable>
  );
}
