// app/(tabs)/index.tsx
import { spacing } from '@/src/theme/spaces';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { CategoryPieChart, CategorySlice } from '../../src/components/CategoryPieChart';
import { Screen } from '../../src/components/Screen';
import { colors } from '../../src/theme/colors';

export default function DashboardScreen() {
  // Dummy data for now – we'll wire real data later
  const monthName = 'December';
  const totalSpent = 42580;
  const budget = 60000;
  const remaining = budget - totalSpent;
  const remainingPct = Math.max(0, Math.round((remaining / budget) * 100));

  const categoryData: CategorySlice[] = [
    {
      key: 'food',
      label: 'Food & Dining',
      amount: 12400,
      color: '#22c55e',
    },
    {
      key: 'entertainment',
      label: 'Entertainment',
      amount: 7800,
      color: '#6366f1',
    },
    {
      key: 'shopping',
      label: 'Shopping',
      amount: 10180,
      color: '#ec4899',
    },
    {
      key: 'fuel',
      label: 'Fuel & Transport',
      amount: 8950,
      color: '#f97316',
    },
    {
      key: 'bills',
      label: 'Bills & Utilities',
      amount: 8250,
      color: '#eab308',
    },
  ];

  const recentTransactions = [
    { label: 'Zomato – Dinner', category: 'Food', amount: 620, time: 'Today • 8:12 PM' },
    { label: 'Ola – Airport drop', category: 'Transport', amount: 890, time: 'Today • 5:02 PM' },
    { label: 'Amazon – Headphones', category: 'Shopping', amount: 2199, time: 'Yesterday • 9:30 PM' },
  ];

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.appName}>SpendWise</Text>
          <Text style={styles.subtitle}>This month&apos;s overview</Text>
        </View>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>On track</Text>
        </View>
      </View>

      <Card variant="accent" style={styles.summaryCard}>
        <Text style={styles.monthLabel}>{monthName} summary</Text>
        <Text style={styles.totalLabel}>Total spent</Text>
        <Text style={styles.totalAmount}>₹{totalSpent.toLocaleString()}</Text>

        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.subLabel}>Budget</Text>
            <Text style={styles.subValue}>₹{budget.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.subLabel}>Remaining</Text>
            <Text style={styles.subValuePositive}>
              ₹{remaining.toLocaleString()} ({remainingPct}%)
            </Text>
          </View>
        </View>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, (totalSpent / budget) * 100)}%` },
            ]}
          />
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Spending by category</Text>
        <Text style={styles.sectionLabel}>Dec 1–31</Text>
      </View>

      <Card style={styles.pieCard}>
        <CategoryPieChart data={categoryData} />
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent transactions</Text>
        <Text style={styles.sectionLabel}>View all</Text>
      </View>

      <Card style={styles.listCard}>
        {recentTransactions.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.transactionRow,
              index < recentTransactions.length - 1 && styles.transactionRowBorder,
            ]}
          >
            <View>
              <Text style={styles.transactionLabel}>{item.label}</Text>
              <Text style={styles.transactionMeta}>
                {item.category} · {item.time}
              </Text>
            </View>
            <Text style={styles.transactionAmount}>-₹{item.amount.toLocaleString()}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 6,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '500',
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  monthLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  totalLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  totalAmount: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  subLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  subValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  subValuePositive: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#0b1220',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  pieCard: {
    marginTop: spacing.xs,
  },
  listCard: {
    marginTop: spacing.sm,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  transactionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  transactionLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  transactionMeta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});
