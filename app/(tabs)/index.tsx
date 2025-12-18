import { spacing } from '@/src/theme/spaces';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import {
  CategoryPieChart,
  CategorySlice,
} from '../../src/components/CategoryPieChart';
import { EssentialSplitModal } from '../../src/components/EssentialSplitModal';
import { Screen } from '../../src/components/Screen';
import { useExpenses } from '../../src/context/ExpensesContext';
import { colors } from '../../src/theme/colors';

/* ---------------- CATEGORY META ---------------- */

const CATEGORY_META: Record<
  string,
  { label: string; color: string; type: 'essential' | 'non-essential' }
> = {
  // Essential
  rent: { label: 'Rent', color: '#22c55e', type: 'essential' },
  fuel: { label: 'Fuel', color: '#f97316', type: 'essential' },
  bills: { label: 'Bills', color: '#eab308', type: 'essential' },
  grocery: { label: 'Grocery', color: '#10b981', type: 'essential' },
  transport: { label: 'Transport', color: '#0ea5e9', type: 'essential' },
  pet_supplies: { label: 'Pet Supplies', color: '#8b5cf6', type: 'essential' },

  // Non-essential
  food: { label: 'Food', color: '#ef4444', type: 'non-essential' },
  fun: { label: 'Fun', color: '#6366f1', type: 'non-essential' },
  shopping: { label: 'Shopping', color: '#ec4899', type: 'non-essential' },
  party: { label: 'Party', color: '#f43f5e', type: 'non-essential' },
  movies: { label: 'Movies', color: '#14b8a6', type: 'non-essential' },

  // Fallback
  other: { label: 'Other', color: '#6b7280', type: 'non-essential' },
};

export default function DashboardScreen() {
  const router = useRouter();
  const { expenses, budget } = useExpenses();
  const today = new Date();

  const [splitOpen, setSplitOpen] = useState(false);

  const {
    monthName,
    totalSpent,
    categorySlices,
    recentTransactions,
    pastThreeMonths,
  } = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('en-IN', { month: 'long' });

    const m = today.getMonth();
    const y = today.getFullYear();

    const currentMonthExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === m && d.getFullYear() === y;
    });

    const totalSpent = currentMonthExpenses.reduce(
      (s, e) => s + e.amount,
      0
    );

    const categoryTotals: Record<string, number> = {};
    currentMonthExpenses.forEach((e) => {
      categoryTotals[e.category] =
        (categoryTotals[e.category] || 0) + e.amount;
    });

    const categorySlices: CategorySlice[] = Object.entries(
      categoryTotals
    ).map(([key, amount]) => ({
      key,
      label: CATEGORY_META[key]?.label || 'Other',
      amount,
      color: CATEGORY_META[key]?.color || '#6b7280',
    }));

    const recentTransactions = [...expenses]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 3);

    const pastThreeMonths = Array.from({ length: 3 }).map((_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const mm = d.getMonth();
      const yy = d.getFullYear();

      const monthExpenses = expenses.filter((e) => {
        const ed = new Date(e.date);
        return ed.getMonth() === mm && ed.getFullYear() === yy;
      });

      const total = monthExpenses.reduce((s, e) => s + e.amount, 0);

      return {
        key: `${yy}-${mm}`,
        label: formatter.format(d),
        total,
      };
    });

    return {
      monthName: formatter.format(today),
      totalSpent,
      categorySlices,
      recentTransactions,
      pastThreeMonths,
    };
  }, [expenses]);

  /* -------- Essential / Non-essential split -------- */

  const essentialData = useMemo(
    () =>
      categorySlices.filter(
        (c) => CATEGORY_META[c.key]?.type === 'essential'
      ),
    [categorySlices]
  );

  const nonEssentialData = useMemo(
    () =>
      categorySlices.filter(
        (c) => CATEGORY_META[c.key]?.type === 'non-essential'
      ),
    [categorySlices]
  );

  const essentialTotal = essentialData.reduce(
    (s, c) => s + c.amount,
    0
  );
  const nonEssentialTotal = nonEssentialData.reduce(
    (s, c) => s + c.amount,
    0
  );

  const remaining = budget - totalSpent;
  const progress =
    budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;

  return (
    <Screen>
      {/* ===== Monthly Summary ===== */}
      <Card style={styles.summaryCard}>
        <Text style={styles.monthLabel}>{monthName} overview</Text>
        <Text style={styles.totalAmount}>
          ₹{totalSpent.toLocaleString()}
        </Text>
        <Text style={styles.subText}>Total spent this month</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.smallLabel}>Budget</Text>
            <Text style={styles.value}>₹{budget.toLocaleString()}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.smallLabel}>Remaining</Text>
            <Text
              style={[
                styles.value,
                remaining < 0 && { color: '#f97373' },
              ]}
            >
              ₹{remaining.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.progressBg}>
          <View
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
      </Card>

      {/* ===== Category Chart ===== */}
      <Text style={styles.sectionTitle}>Spending by category</Text>
      {categorySlices.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Add some expenses to see breakdown.
          </Text>
        </Card>
      ) : (
        <Pressable onPress={() => setSplitOpen(true)}>
          <Card>
            <CategoryPieChart data={categorySlices} />
          </Card>
        </Pressable>
      )}

      {/* ===== Recent ===== */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent transactions</Text>
        <Pressable onPress={() => router.push('/(tabs)/two')}>
          <Text style={styles.link}>View all</Text>
        </Pressable>
      </View>

      <Card>
        {recentTransactions.map((e, i) => (
          <View
            key={e.id}
            style={[
              styles.txRow,
              i < recentTransactions.length - 1 &&
                styles.txBorder,
            ]}
          >
            <View>
              <Text style={styles.txLabel}>
                {e.note || CATEGORY_META[e.category]?.label || 'Expense'}
              </Text>
              <Text style={styles.txMeta}>
                {new Date(e.date).toDateString()}
              </Text>
            </View>
            <Text style={styles.txAmount}>
              -₹{e.amount.toLocaleString()}
            </Text>
          </View>
        ))}
      </Card>

      {/* ===== Past 3 Months ===== */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Past 3 months</Text>
        <Pressable onPress={() => router.push('/analytics')}>
          <Text style={styles.link}>View analytics</Text>
        </Pressable>
      </View>

      <View style={styles.monthGrid}>
        {pastThreeMonths.map((m) => (
          <Card key={m.key} style={styles.monthCard}>
            <Text style={styles.monthCardLabel}>{m.label}</Text>
            <Text style={styles.monthCardAmount}>
              ₹{m.total.toLocaleString()}
            </Text>
          </Card>
        ))}
      </View>

      <View style={{ height: spacing.xxl * 3 }} />

      {/* ===== Essential vs Non-Essential Modal ===== */}
      <EssentialSplitModal
        visible={splitOpen}
        monthLabel={monthName}
        essentialData={essentialData}
        nonEssentialData={nonEssentialData}
        essentialTotal={essentialTotal}
        nonEssentialTotal={nonEssentialTotal}
        onClose={() => setSplitOpen(false)}
      />
    </Screen>
  );
}

/* ---------------- STYLES (unchanged) ---------------- */

const styles = StyleSheet.create({
  summaryCard: { marginBottom: spacing.lg },
  monthLabel: { fontSize: 13, color: colors.textMuted },
  totalAmount: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  subText: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  smallLabel: { fontSize: 12, color: colors.textMuted },
  value: { fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  progressBg: { height: 6, borderRadius: 999, backgroundColor: '#0b1220' },
  progressFill: { height: '100%', backgroundColor: colors.accent },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  sectionHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: { color: colors.accent, fontSize: 13, fontWeight: '500' },
  emptyCard: { paddingVertical: spacing.md },
  emptyText: { fontSize: 13, color: colors.textSecondary },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  txBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  txLabel: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  txMeta: { fontSize: 12, color: colors.textMuted },
  txAmount: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  monthGrid: { flexDirection: 'row', gap: spacing.sm },
  monthCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  monthCardLabel: { fontSize: 13, color: colors.textSecondary },
  monthCardAmount: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
