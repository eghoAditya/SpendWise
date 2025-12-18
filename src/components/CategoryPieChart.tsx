import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { DonutPieChart } from './PiCharts';

export type CategorySlice = {
  key: string;
  label: string;
  amount: number;
  color: string;
};

type Props = {
  data: CategorySlice[];
  onDonutPressComplete?: () => void;
};

export function CategoryPieChart({
  data,
  onDonutPressComplete,
}: Props) {
  const total = data.reduce((s, c) => s + c.amount, 0);

  const slices = useMemo(
    () =>
      data.map((c) => ({
        value: c.amount,
        color: c.color,
      })),
    [data]
  );

  return (
    <View style={styles.row}>
      {/* DONUT */}
      <DonutPieChart
        data={slices}
        onSpinEnd={onDonutPressComplete}
      />

      {/* LEGEND */}
      <View style={styles.legend}>
        {data.map((c) => (
          <View key={c.key} style={styles.legendRow}>
            <View
              style={[styles.dot, { backgroundColor: c.color }]}
            />
            <Text style={styles.label}>
              {Math.round((c.amount / total) * 100)}% {c.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legend: {
    marginLeft: 20,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
