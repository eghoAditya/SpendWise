import { spacing } from '@/src/theme/spaces';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { useExpenses } from '../../src/context/ExpensesContext';
import { colors } from '../../src/theme/colors';
import { Expense, ExpenseCategory } from '../../src/types/expense';

const CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  food: { label: 'Food & Dining', icon: 'fast-food-outline' },
  entertainment: { label: 'Entertainment', icon: 'game-controller-outline' },
  shopping: { label: 'Shopping', icon: 'bag-handle-outline' },
  fuel: { label: 'Fuel & Transport', icon: 'car-outline' },
  bills: { label: 'Bills & Utilities', icon: 'flash-outline' },
  other: { label: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
};

export default function ExpensesScreen() {
  const { expenses, deleteExpense } = useExpenses();

  const sortedExpenses = useMemo(
    () =>
      [...expenses].sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0
      ),
    [expenses]
  );

  const confirmDelete = (expense: Expense) => {
    const label =
      expense.note?.trim() || CATEGORY_META[expense.category].label;

    if (Platform.OS === 'web') {
      const ok = window.confirm(
        `Are you sure you want to delete "${label}"?`
      );
      if (ok) {
        deleteExpense(expense.id);
      }
      return;
    }

    Alert.alert(
      'Delete expense',
      `Are you sure you want to delete "${label}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteExpense(expense.id),
        },
      ]
    );
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>All expenses</Text>
          <Text style={styles.subtitle}>
            Browse your full spending history.
          </Text>
        </View>
        <View style={styles.iconBadge}>
          <Ionicons
            name="filter-outline"
            size={18}
            color={colors.textSecondary}
          />
        </View>
      </View>

      {sortedExpenses.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            You haven&apos;t logged any expenses yet. Add your first one from the
            Add tab.
          </Text>
        </Card>
      ) : (
        <Card style={styles.listCard}>
          <FlatList
            data={sortedExpenses}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <ExpenseRow
                expense={item}
                onDelete={() => confirmDelete(item)}
              />
            )}
          />
        </Card>
      )}
    </Screen>
  );
}

function ExpenseRow({
  expense,
  onDelete,
}: {
  expense: Expense;
  onDelete: () => void;
}) {
  const meta = CATEGORY_META[expense.category];

  const created = new Date(expense.date);
  const dateLabel = created.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.iconCircle}>
          <Ionicons name={meta.icon} size={18} color={colors.accent} />
        </View>
        <View>
          <Text style={styles.rowTitle}>
            {expense.note?.trim() || meta.label}
          </Text>
          <Text style={styles.rowSubtitle}>
            {meta.label} · {dateLabel}
          </Text>
        </View>
      </View>

      <View style={styles.rowRight}>
        <Text style={styles.rowAmount}>
          -₹{expense.amount.toLocaleString()}
        </Text>
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
          ]}
        >
          <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  emptyCard: {
    paddingVertical: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  listCard: {
    paddingVertical: spacing.sm,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rowLeft: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  rowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  rowAmount: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  deleteButtonPressed: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
  },
  rowTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  rowSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
});
