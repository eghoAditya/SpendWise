import { Card } from '@/src/components/Card';
import { Screen } from '@/src/components/Screen';
import { useExpenses } from '@/src/context/ExpensesContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spaces';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type MonthKey = {
  year: number;
  month: number; // 0-11
};

export default function ExpensesScreen() {
  const { expenses, deleteExpense } = useExpenses();

  const current = new Date();
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>({
    year: current.getFullYear(),
    month: current.getMonth(),
  });

  const availableMonths = useMemo<MonthKey[]>(() => {
    const map = new Map<string, MonthKey>();

    expenses.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map.has(key)) {
        map.set(key, { year: d.getFullYear(), month: d.getMonth() });
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const da = new Date(a.year, a.month).getTime();
      const db = new Date(b.year, b.month).getTime();
      return db - da; // newest first
    });
  }, [expenses]);

  const { filteredExpenses, monthLabel } = useMemo(() => {
    const filtered = expenses.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getFullYear() === selectedMonth.year &&
        d.getMonth() === selectedMonth.month
      );
    });

    const label = new Date(
      selectedMonth.year,
      selectedMonth.month
    ).toLocaleString('en-IN', {
      month: 'long',
      year: 'numeric',
    });

    return { filteredExpenses: filtered, monthLabel: label };
  }, [expenses, selectedMonth]);

  return (
    <Screen>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Expenses</Text>
      </View>

      {/* MONTH SELECTOR */}
      <View style={styles.monthSelector}>
        {availableMonths.map((m) => {
          const active =
            m.year === selectedMonth.year &&
            m.month === selectedMonth.month;

          return (
            <Pressable
              key={`${m.year}-${m.month}`}
              onPress={() => setSelectedMonth(m)}
              style={[
                styles.monthChip,
                active && styles.monthChipActive,
              ]}
            >
              <Text
                style={[
                  styles.monthChipText,
                  active && styles.monthChipTextActive,
                ]}
              >
                {new Date(m.year, m.month).toLocaleString('en-IN', {
                  month: 'short',
                })}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* LIST HEADER */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{monthLabel}</Text>
      </View>

      {/* LIST */}
      {filteredExpenses.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>
            No expenses for this month.
          </Text>
        </Card>
      ) : (
        <Card>
          {filteredExpenses
            .sort(
              (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime()
            )
            .map((e) => (
              <View key={e.id} style={styles.row}>
                <View>
                  <Text style={styles.label}>
                    {e.note || e.category}
                  </Text>
                  <Text style={styles.date}>
                    {new Date(e.date).toLocaleDateString('en-IN')}
                  </Text>
                </View>

                <View style={styles.right}>
                  <Text style={styles.amount}>
                    ₹{e.amount.toLocaleString()}
                  </Text>
                  <Pressable onPress={() => deleteExpense(e.id)}>
                    <Text style={styles.delete}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { marginBottom: spacing.lg },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  monthSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  monthChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  monthChipActive: {
    backgroundColor: colors.accent,
  },
  monthChipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  monthChipTextActive: {
    color: '#020617',
    fontWeight: '600',
  },

  sectionHeader: { marginBottom: spacing.sm },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  delete: {
    fontSize: 12,
    color: '#f97373',
    marginTop: 2,
  },
});
