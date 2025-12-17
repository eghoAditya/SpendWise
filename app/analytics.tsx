import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { useExpenses } from '@/src/context/ExpensesContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spaces';
import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BarChart, PieChart } from 'react-native-chart-kit';

type MonthMeta = {
  label: string;
  month: number;
  year: number;
  total: number;
};

export default function AnalyticsScreen() {
  const { expenses } = useExpenses();
  const [chartWidth, setChartWidth] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<MonthMeta | null>(null);

  // ---------- LAST 3 MONTHS ----------
  const monthsData = useMemo(() => {
    const now = new Date();

    return Array.from({ length: 3 })
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
          month: d.getMonth(),
          year: d.getFullYear(),
          total,
        };
      })
      .reverse();
  }, [expenses]);

  useEffect(() => {
    if (!selectedMonth && monthsData.length > 0) {
      setSelectedMonth(monthsData[monthsData.length - 1]);
    }
  }, [monthsData, selectedMonth]);

  const categoryData = useMemo(() => {
    if (!selectedMonth) return [];

    const totals: Record<string, number> = {};

    expenses.forEach((e) => {
      const d = new Date(e.date);
      if (
        d.getMonth() === selectedMonth.month &&
        d.getFullYear() === selectedMonth.year
      ) {
        totals[e.category] = (totals[e.category] || 0) + e.amount;
      }
    });

    const COLORS: Record<string, string> = {
      rent: '#22c55e',
      fuel: '#f97316',
      bills: '#eab308',
      grocery: '#10b981',
      transport: '#0ea5e9',
      pet: '#8b5cf6',
    
      food: '#ef4444',
      entertainment: '#6366f1',
      shopping: '#ec4899',
      party: '#f43f5e',
      movies: '#14b8a6',
    
      other: '#6b7280',
    };
    

    return Object.keys(totals).map((key) => ({
      name: key,
      amount: totals[key],
      color: COLORS[key] || colors.textMuted,
      legendFontColor: colors.textSecondary,
      legendFontSize: 12,
    }));
  }, [expenses, selectedMonth]);

  const onChartLayout = (e: LayoutChangeEvent) => {
    setChartWidth(e.nativeEvent.layout.width);
  };

  return (
    <Screen>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.subtitle}>Last 3 months overview</Text>
      </View>

      {/* MONTH CARDS */}
      <View style={styles.cardRow}>
        {monthsData.map((m) => {
          const isActive =
            selectedMonth?.month === m.month &&
            selectedMonth?.year === m.year;

          return (
            <Pressable
              key={m.label}
              onPress={() => setSelectedMonth(m)}
              style={[
                styles.monthPressable,
                isActive && styles.monthActive,
              ]}
            >
              <Card>
                <Text style={styles.monthLabel}>{m.label}</Text>
                <Text style={styles.monthAmount}>
                  ₹{m.total.toLocaleString()}
                </Text>
              </Card>
            </Pressable>
          );
        })}
      </View>

      {/* MONTHLY BAR CHART */}
      <Card style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Monthly spending</Text>

        <View onLayout={onChartLayout}>
          {chartWidth > 0 && (
            <BarChart
              data={{
                labels: monthsData.map((m) => m.label),
                datasets: [{ data: monthsData.map((m) => m.total) }],
              }}
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
            />
          )}
        </View>
      </Card>

      {/* CATEGORY BREAKDOWN */}
      {selectedMonth && categoryData.length > 0 && (
        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>
            {selectedMonth.label} category breakdown
          </Text>

          <PieChart
            data={categoryData}
            width={chartWidth}
            height={220}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="12"
            chartConfig={{ color: () => colors.textPrimary }}
          />

          {/* SCROLLABLE CATEGORY LIST */}
          <ScrollView
            style={styles.categoryScroll}
            showsVerticalScrollIndicator={false}
          >
            {categoryData.map((c) => (
              <View key={c.name} style={styles.categoryRow}>
                <View
                  style={[styles.dot, { backgroundColor: c.color }]}
                />
                <Text style={styles.categoryLabel}>
                  {c.name}
                </Text>
                <Text style={styles.categoryAmount}>
                  ₹{c.amount.toLocaleString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  cardRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  monthPressable: {
    flex: 1,
  },
  monthActive: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 16,
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
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  categoryScroll: {
    maxHeight: 220, // ✅ fits ~6 categories, scrolls after
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: spacing.sm,
  },
  categoryLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  categoryAmount: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
