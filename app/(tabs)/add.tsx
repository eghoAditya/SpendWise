import { spacing } from '@/src/theme/spaces';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { useExpenses } from '../../src/context/ExpensesContext';
import { colors } from '../../src/theme/colors';
import { ExpenseCategory } from '../../src/types/expense';

const CATEGORIES: {
  key: ExpenseCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: 'food',          label: 'Food',          icon: 'fast-food-outline' },
  { key: 'entertainment', label: 'Fun',           icon: 'game-controller-outline' },
  { key: 'shopping',      label: 'Shopping',      icon: 'bag-handle-outline' },
  { key: 'fuel',          label: 'Fuel',          icon: 'car-outline' },
  { key: 'bills',         label: 'Bills',         icon: 'flash-outline' },
  { key: 'other',         label: 'Other',         icon: 'ellipsis-horizontal-circle-outline' },
];

export default function AddExpenseScreen() {
  const { addExpense } = useExpenses();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  // For now, always "today"
  const today = new Date();
  const dateISO = today.toISOString().slice(0, 10);
  const dateLabel = 'Today';

  const parsedAmount = parseFloat(amount.replace(/,/g, '.'));
  const amountIsValid = !isNaN(parsedAmount) && parsedAmount > 0;
  const formIsValid = amountIsValid && !!category;

  const handleSubmit = () => {
    setTouched(true);
    if (!formIsValid) return;

    setSubmitting(true);

    // Add to global state
    addExpense({
      amount: parsedAmount,
      category,
      note,
      date: dateISO,
    });

    // Simulate short delay for nicer UX (for the spinner)
    setTimeout(() => {
      setSubmitting(false);
      setAmount('');
      setNote('');
      setCategory('food');
      setTouched(false);
    }, 350);
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Add expense</Text>
              <Text style={styles.subtitle}>
                Log a new transaction to keep your spending on track.
              </Text>
            </View>
            <View style={styles.iconBadge}>
              <Ionicons name="wallet-outline" size={22} color={colors.accent} />
            </View>
          </View>

          <Card style={styles.formCard}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountRow}>
              <Text style={styles.currency}>₹</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                style={styles.amountInput}
                onBlur={() => setTouched(true)}
              />
            </View>
            {touched && !amountIsValid && (
              <Text style={styles.errorText}>
                Enter a valid amount greater than 0.
              </Text>
            )}

            <Text style={[styles.label, { marginTop: spacing.lg }]}>
              Category
            </Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((item) => {
                const isActive = item.key === category;
                return (
                  <View key={item.key} style={{ flex: 1, minWidth: '30%' }}>
                    <Card
                      style={[
                        styles.categoryCard,
                        isActive && styles.categoryCardActive,
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={isActive ? colors.accent : colors.textSecondary}
                        onPress={() => setCategory(item.key)}
                      />
                      <Text
                        style={[
                          styles.categoryLabel,
                          isActive && styles.categoryLabelActive,
                        ]}
                        onPress={() => setCategory(item.key)}
                      >
                        {item.label}
                      </Text>
                    </Card>
                  </View>
                );
              })}
            </View>

            <Text style={[styles.label, { marginTop: spacing.lg }]}>Date</Text>
            <View style={styles.inlineRow}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.dateText}>{dateLabel}</Text>
              <Text style={styles.dateHint}>(today&apos;s date is used)</Text>
            </View>

            <Text style={[styles.label, { marginTop: spacing.lg }]}>Note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Optional note (e.g. dinner, cab, groceries)"
              placeholderTextColor={colors.textMuted}
              style={styles.noteInput}
              multiline
              numberOfLines={3}
            />

            <PrimaryButton
              label="Save expense"
              onPress={handleSubmit}
              loading={submitting}
              disabled={!formIsValid}
              style={{ marginTop: spacing.xl }}
            />
          </Card>

          <View style={styles.helperTextWrapper}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.helperText}>
              Once saved, this expense immediately flows into your dashboard,
              chart, and history.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#020617',
  },
  currency: {
    fontSize: 18,
    color: colors.textSecondary,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#f97373',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: '#020617',
    gap: 8,
  },
  categoryCardActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  categoryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  categoryLabelActive: {
    color: colors.accent,
    fontWeight: '500',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dateText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  dateHint: {
    fontSize: 11,
    color: colors.textMuted,
  },
  noteInput: {
    marginTop: 4,
    minHeight: 76,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  helperTextWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: spacing.sm,
  },
  helperText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
