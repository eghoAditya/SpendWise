import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { useExpenses } from '@/src/context/ExpensesContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spaces';
import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { BarChart } from 'react-native-chart-kit';

export default function AnalyticsScreen() {
  const { expenses } = useExpenses();
  const [chartWidth, setChartWidth] = useState<number>(0);

  const chartData = useMemo(() => {
    const now = new Date();

    const months = Array.from({ length: 3 })
      .map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

        const total = expenses
          .filter((e) => {
            const ed = new Date(e.date);
            return (
              ed.getMonth() === d.getMonth() &&
              ed.getFullYear() === d.getFullYear()
            );
          })
          .reduce((sum, e) => sum + e.amount, 0);

        return {
          label: d.toLocaleString('en-IN', { month: 'short' }),
          value: total,
        };
      })
      .reverse();

    return {
      labels: months.map((m) => m.label),
      datasets: [{ data: months.map((m) => m.value) }],
    };
  }, [expenses]);

  const onChartLayout = (e: LayoutChangeEvent) => {
    setChartWidth(e.nativeEvent.layout.width);
  };

  return (
    <Screen>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>
          Spending over the last 3 months
        </Text>
      </View>

      {/* SUMMARY CARDS */}
      <View style={styles.cardRow}>
        {chartData.labels.map((label, i) => (
          <Card key={label} style={styles.monthCard}>
            <Text style={styles.monthLabel}>{label}</Text>
            <Text style={styles.monthAmount}>
              ₹{chartData.datasets[0].data[i].toLocaleString()}
            </Text>
          </Card>
        ))}
      </View>

      {/* BAR CHART */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Monthly spending</Text>

        <View onLayout={onChartLayout}>
          {chartWidth > 0 && (
            <BarChart
              data={chartData}
              width={chartWidth}
              height={220}
              yAxisLabel="₹"
              yAxisSuffix=""
              fromZero
              showValuesOnTopOfBars
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 0,
                color: () => colors.accent,
                labelColor: () => colors.textSecondary,
                propsForBackgroundLines: {
                  stroke: colors.borderSubtle,
                  strokeDasharray: '4',
                },
              }}
              style={{
                marginTop: spacing.sm,
                borderRadius: 12,
              }}
            />
          )}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },

  cardRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  monthCard: {
    flex: 1,
    padding: spacing.md,
  },
  monthLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  monthAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },

  chartCard: {
    paddingVertical: spacing.md,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
