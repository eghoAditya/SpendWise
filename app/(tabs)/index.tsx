import { spacing } from '@/src/theme/spaces';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Card } from '../../src/components/Card';
import {
  CategoryPieChart,
  CategorySlice,
} from '../../src/components/CategoryPieChart';
import { Screen } from '../../src/components/Screen';
import { useExpenses } from '../../src/context/ExpensesContext';
import { colors } from '../../src/theme/colors';
import { ExpenseCategory } from '../../src/types/expense';

const CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; color: string }
> = {
  food: { label: 'Food & Dining', color: '#22c55e' },
  entertainment: { label: 'Entertainment', color: '#6366f1' },
  shopping: { label: 'Shopping', color: '#ec4899' },
  fuel: { label: 'Fuel & Transport', color: '#f97316' },
  bills: { label: 'Bills & Utilities', color: '#eab308' },
  other: { label: 'Other', color: '#6b7280' },
};

export default function DashboardScreen() {
  const router = useRouter();
  const { expenses, budget, updateBudget } = useExpenses();
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const [isBudgetEditorOpen, setIsBudgetEditorOpen] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState(budget.toString());
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const {
    monthName,
    totalSpent,
    monthExpenses,
    categorySlices,
    recentTransactions,
  } = useMemo(() => {
    const monthNameFormatter = new Intl.DateTimeFormat('en-IN', {
      month: 'long',
    });

    const monthName = monthNameFormatter.format(today);

    const monthExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });

    const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const categoryTotals: Record<ExpenseCategory, number> = {
      food: 0,
      entertainment: 0,
      shopping: 0,
      fuel: 0,
      bills: 0,
      other: 0,
    };

    monthExpenses.forEach((e) => {
      categoryTotals[e.category] += e.amount;
    });

    const categorySlices: CategorySlice[] = (Object.keys(
      categoryTotals
    ) as ExpenseCategory[])
      .filter((key) => categoryTotals[key] > 0)
      .map((key) => ({
        key,
        label: CATEGORY_META[key].label,
        amount: categoryTotals[key],
        color: CATEGORY_META[key].color,
      }));

    const recent = [...expenses]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 3);

    return {
      monthName,
      totalSpent,
      monthExpenses,
      categorySlices,
      recentTransactions: recent,
    };
  }, [expenses, thisMonth, thisYear, today]);

  const remaining = budget - totalSpent;
  const remainingPct =
    budget > 0 ? Math.max(0, Math.round((remaining / budget) * 100)) : 0;

  const handleViewAllPress = () => {
    router.push('/(tabs)/two');
  };

  const openBudgetEditor = () => {
    setBudgetDraft(budget.toString());
    setBudgetError(null);
    setIsBudgetEditorOpen(true);
  };

  const handleBudgetSave = () => {
    const parsed = parseFloat(budgetDraft.replace(/,/g, '.'));
    if (isNaN(parsed) || parsed <= 0) {
      setBudgetError('Please enter a valid positive number.');
      return;
    }
    const normalized = Math.round(parsed);
    updateBudget(normalized);
    setIsBudgetEditorOpen(false);
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.appName}>SpendWise</Text>
          <Text style={styles.subtitle}>
            {monthExpenses.length === 0
              ? 'Start by logging your first expense.'
              : "This month's overview"}
          </Text>
        </View>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>
            {totalSpent === 0 ? 'No data yet' : 'On track'}
          </Text>
        </View>
      </View>

      <Card variant="accent" style={styles.summaryCard}>
        <Text style={styles.monthLabel}>{monthName} summary</Text>
        <Text style={styles.totalLabel}>Total spent</Text>
        <Text style={styles.totalAmount}>₹{totalSpent.toLocaleString()}</Text>

        <View style={styles.summaryRow}>
          <Pressable onPress={openBudgetEditor} style={styles.budgetTapArea}>
            <Text style={styles.subLabel}>Budget (tap to edit)</Text>
            <Text style={styles.subValue}>
              ₹{budget.toLocaleString()}
            </Text>
          </Pressable>

          <View style={styles.summaryRight}>
            <Text style={styles.subLabel}>Remaining</Text>
            <Text
              style={
                remaining >= 0 ? styles.subValuePositive : styles.subValueOver
              }
            >
              ₹{remaining.toLocaleString()}
              {budget > 0 ? ` (${remainingPct}%)` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width:
                  budget > 0
                    ? `${Math.min(100, (totalSpent / budget) * 100)}%`
                    : '0%',
              },
            ]}
          />
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Spending by category</Text>
        <Text style={styles.sectionLabel}>
          {monthExpenses.length === 0 ? 'No data yet' : 'This month'}
        </Text>
      </View>

      {categorySlices.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Once you add expenses, this chart will break down your spending by
            category.
          </Text>
        </Card>
      ) : (
        <Card style={styles.pieCard}>
          <CategoryPieChart data={categorySlices} />
        </Card>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent transactions</Text>
        <Pressable onPress={handleViewAllPress}>
          <Text style={styles.sectionLink}>View all</Text>
        </Pressable>
      </View>

      {recentTransactions.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Your most recent transactions will show up here.
          </Text>
        </Card>
      ) : (
        <Card style={styles.listCard}>
          {recentTransactions.map((item, index) => {
            const created = new Date(item.createdAt);
            const timeLabel = created.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            });
            const dateLabel = created.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            });

            const categoryLabel = CATEGORY_META[item.category].label;

            return (
              <View
                key={item.id}
                style={[
                  styles.transactionRow,
                  index < recentTransactions.length - 1 &&
                    styles.transactionRowBorder,
                ]}
              >
                <View>
                  <Text style={styles.transactionLabel}>
                    {item.note || categoryLabel}
                  </Text>
                  <Text style={styles.transactionMeta}>
                    {categoryLabel} · {dateLabel} • {timeLabel}
                  </Text>
                </View>
                <Text style={styles.transactionAmount}>
                  -₹{item.amount.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </Card>
      )}

      {isBudgetEditorOpen && (
        <View style={styles.budgetOverlay}>
          <View style={styles.budgetDialog}>
            <Text style={styles.dialogTitle}>Edit monthly budget</Text>
            <Text style={styles.dialogSubtitle}>
              This budget is used to calculate your remaining amount and
              progress.
            </Text>
            <View style={styles.budgetInputRow}>
              <Text style={styles.currency}>₹</Text>
              <TextInput
                value={budgetDraft}
                onChangeText={(text) => {
                  setBudgetDraft(text);
                  setBudgetError(null);
                }}
                placeholder="60000"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                style={styles.budgetInput}
              />
            </View>
            {budgetError && (
              <Text style={styles.budgetError}>{budgetError}</Text>
            )}
            <View style={styles.dialogActions}>
              <Pressable
                onPress={() => setIsBudgetEditorOpen(false)}
                style={({ pressed }) => [
                  styles.dialogButton,
                  pressed && styles.dialogButtonPressed,
                ]}
              >
                <Text style={styles.dialogButtonTextSecondary}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleBudgetSave}
                style={({ pressed }) => [
                  styles.dialogButton,
                  styles.dialogButtonPrimary,
                  pressed && styles.dialogButtonPrimaryPressed,
                ]}
              >
                <Text style={styles.dialogButtonTextPrimary}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
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
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 6,
  },
  badgeText: {
    color: colors.textSecondary,
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
  budgetTapArea: {
    paddingRight: spacing.sm,
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
  subValueOver: {
    color: '#f97373',
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
  sectionLink: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '500',
  },
  pieCard: {
    marginTop: spacing.xs,
  },
  listCard: {
    marginTop: spacing.sm,
  },
  emptyCard: {
    paddingVertical: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
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
  budgetOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'flex-end',
  },
  budgetDialog: {
    backgroundColor: '#020617',
    padding: spacing.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: colors.borderSubtle,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dialogSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  budgetInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#020617',
    marginTop: spacing.lg,
  },
  currency: {
    fontSize: 18,
    color: colors.textSecondary,
    marginRight: 4,
  },
  budgetInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  budgetError: {
    marginTop: 4,
    fontSize: 12,
    color: '#f97373',
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  dialogButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
  },
  dialogButtonPressed: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
  },
  dialogButtonPrimary: {
    backgroundColor: colors.accent,
  },
  dialogButtonPrimaryPressed: {
    opacity: 0.9,
  },
  dialogButtonTextSecondary: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  dialogButtonTextPrimary: {
    color: '#020617',
    fontSize: 14,
    fontWeight: '600',
  },
});
