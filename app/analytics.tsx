import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { useExpenses } from '@/src/context/ExpensesContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spaces';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AnalyticsScreen() {
  const { expenses } = useExpenses();

  const pastThreeMonths = useMemo(() => {
    const now = new Date();

    return Array.from({ length: 3 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const monthExpenses = expenses.filter((e) => {
        const ed = new Date(e.date);
        return (
          ed.getMonth() === d.getMonth() &&
          ed.getFullYear() === d.getFullYear()
        );
      });

      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString('en-IN', {
          month: 'long',
          year: 'numeric',
        }),
        total: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
      };
    });
  }, [expenses]);

  return (
    <Screen>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Last 3 months overview</Text>
      </View>

      {/* MONTH SUMMARY */}
      <View style={styles.monthGrid}>
        {pastThreeMonths.map((m) => (
          <Card key={m.key} style={styles.monthCard}>
            <Text style={styles.monthLabel}>{m.label}</Text>
            <Text style={styles.monthAmount}>
              ₹{m.total.toLocaleString()}
            </Text>
          </Card>
        ))}
      </View>
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

  monthGrid: {
    gap: spacing.md,
  },
  monthCard: {
    padding: spacing.md,
  },
  monthLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  monthAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 6,
  },
});
