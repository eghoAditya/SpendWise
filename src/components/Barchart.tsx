import React, { useEffect, useMemo, useRef } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spaces';

type MonthBar = {
  label: string;
  total: number;
};

type Props = {
  months: MonthBar[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

const BAR_MAX_HEIGHT = 140;

export function PremiumMonthlyBarChart({
  months,
  activeIndex,
  onSelect,
}: Props) {
  const maxValue = Math.max(...months.map((m) => m.total), 1);

                        /*  ANIMATION  */
  const animatedHeights = useRef(
    months.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    months.forEach((m, i) => {
      animatedHeights[i].stopAnimation();
      animatedHeights[i].setValue(0);

      Animated.timing(animatedHeights[i], {
        toValue: m.total,
        duration: i === activeIndex ? 650 : 400,
        useNativeDriver: false,
      }).start();
    });
  }, [months, activeIndex]);

                        /*  DELTA  */
  const delta = useMemo(() => {
    const current = months[activeIndex]?.total ?? 0;

    if (activeIndex === 0) {
      return {
        text: `₹${current.toLocaleString()} · 0%`,
        positive: true,
      };
    }

    const prev = months[activeIndex - 1]?.total ?? 0;
    const diff = current - prev;
    const percent =
      prev === 0 ? 0 : Math.round((diff / prev) * 100);

    return {
      text: `${diff >= 0 ? '+' : '-'}₹${Math.abs(diff).toLocaleString()} | ${
        percent >= 0 ? '+' : ''
      }${percent}%`,
      positive: diff >= 0,
    };
  }, [months, activeIndex]);

                    /*  Y AXIS  */
  const yTicks = useMemo(() => {
    const steps = 4;
    return Array.from({ length: steps + 1 }).map((_, i) =>
      Math.round((maxValue / steps) * (steps - i))
    );
  }, [maxValue]);

  return (
    <View>
      {/* ===== HEADER ROW ===== */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Monthly spending</Text>
        <Text
          style={[
            styles.delta,
            delta.positive ? styles.positive : styles.negative,
          ]}
        >
          {delta.text}
        </Text>
      </View>

      {/* ===== CHART ===== */}
      <View style={styles.chartWrapper}>
        {/* Y AXIS */}
        <View style={styles.yAxis}>
          {yTicks.map((v) => (
            <Text key={v} style={styles.yLabel}>
              ₹{v}
            </Text>
          ))}
        </View>

        {/* BARS */}
        <View style={styles.chart}>
          {months.map((m, i) => {
            const isActive = i === activeIndex;
            const barHeight = (m.total / maxValue) * BAR_MAX_HEIGHT;

            const animatedHeight = animatedHeights[i].interpolate({
              inputRange: [0, maxValue],
              outputRange: [0, barHeight],
            });

            return (
              <Pressable
                key={m.label}
                style={styles.barWrapper}
                onPress={() => onSelect(i)}
              >
                <View style={styles.barContainer}>
                  <Animated.View
                    style={[
                      styles.bar,
                      {
                        height: animatedHeight,
                        backgroundColor: isActive
                          ? colors.accent
                          : '#1f2937',
                        opacity: isActive ? 1 : 0.45,
                      },
                    ]}
                  />
                </View>

                <Text
                  style={[
                    styles.barLabel,
                    isActive && styles.barLabelActive,
                  ]}
                >
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        marginBottom: spacing.xxl, 
      },
      
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  delta: {
    fontSize: 13,
    fontWeight: '600',
  },
  positive: { color: '#22c55e' },
  negative: { color: '#ef4444' },

  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
  },

  yAxis: {
    justifyContent: 'space-between',
    height: BAR_MAX_HEIGHT + 20,
    paddingRight: spacing.sm,
  },
  yLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },

  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    height: BAR_MAX_HEIGHT + 20,
    justifyContent: 'space-between',
  },

  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  barContainer: {
    height: BAR_MAX_HEIGHT,
    justifyContent: 'flex-end',
  },

  bar: {
    width: 25,
    borderRadius: 6,
  },

  barLabel: {
    fontSize: 11,
    marginTop: 6,
    color: colors.textMuted,
  },
  barLabelActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
