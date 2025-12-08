import { spacing } from '@/src/theme/spaces';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const parsedAmount = parseFloat(amount.replace(/,/g, '.'));
  const amountIsValid = !isNaN(parsedAmount) && parsedAmount > 0;
  const formIsValid = amountIsValid && !!category;

  const dateISO = selectedDate.toISOString().slice(0, 10);

  const isToday = (() => {
    const now = new Date();
    return (
      selectedDate.getDate() === now.getDate() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear()
    );
  })();

  const dateLabel = isToday
    ? 'Today'
    : selectedDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const handleSubmit = () => {
    setTouched(true);
    if (!formIsValid) return;

    setSubmitting(true);

    addExpense({
      amount: parsedAmount,
      category,
      note,
      date: dateISO,
    });

    setTimeout(() => {
      setSubmitting(false);
      setAmount('');
      setNote('');
      setCategory('food');
      setTouched(false);
      setSelectedDate(new Date());
    }, 350);
  };

  const openDatePicker = () => {
    const current = selectedDate.toISOString().slice(0, 10);

    if (Platform.OS === 'web') {
      const input = window.prompt(
        'Enter date as YYYY-MM-DD',
        current
      );
      if (!input) return;

      const parsed = new Date(input);
      if (!isNaN(parsed.getTime())) {
        setSelectedDate(parsed);
      } else {
        window.alert('Invalid date format. Please use YYYY-MM-DD.');
      }
      return;
    }

    setIsDatePickerOpen(true);
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      setSelectedDate(date);
    }
    if (Platform.OS === 'android') {
      setIsDatePickerOpen(false);
    }
  };

  const closeDatePicker = () => {
    setIsDatePickerOpen(false);
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
                  <Pressable
                    key={item.key}
                    onPress={() => setCategory(item.key)}
                    style={{ flex: 1, minWidth: '30%' }}
                  >
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
                      />
                      <Text
                        style={[
                          styles.categoryLabel,
                          isActive && styles.categoryLabelActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Card>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { marginTop: spacing.lg }]}>Date</Text>
            <Pressable onPress={openDatePicker} style={styles.inlineRowPress}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.dateText}>{dateLabel}</Text>
              <Text style={styles.dateHint}>
                {Platform.OS === 'web'
                  ? '(click to type date)'
                  : '(tap to change)'}
              </Text>
            </Pressable>

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

      {Platform.OS !== 'web' && isDatePickerOpen && (
        <View style={styles.dateOverlay}>
          <Pressable style={styles.overlayBackdrop} onPress={closeDatePicker} />
          <View style={styles.dateDialog}>
            <Text style={styles.dialogTitle}>Select date</Text>
            <Text style={styles.dialogSubtitle}>
              Choose when this expense actually happened.
            </Text>
            <View style={styles.datePickerWrapper}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                themeVariant="dark"
              />
            </View>
            {Platform.OS === 'ios' && (
              <View style={styles.dialogActions}>
                <Pressable
                  onPress={closeDatePicker}
                  style={({ pressed }) => [
                    styles.dialogButton,
                    pressed && styles.dialogButtonPressed,
                  ]}
                >
                  <Text style={styles.dialogButtonTextSecondary}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={closeDatePicker}
                  style={({ pressed }) => [
                    styles.dialogButton,
                    styles.dialogButtonPrimary,
                    pressed && styles.dialogButtonPrimaryPressed,
                  ]}
                >
                  <Text style={styles.dialogButtonTextPrimary}>Done</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      )}
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
  inlineRowPress: {
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
  dateOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
  },
  dateDialog: {
    width: '90%',
    maxWidth: 420,
    borderRadius: 20,
    padding: spacing.lg,
    backgroundColor: '#020617',
    borderWidth: 1,
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
    marginBottom: spacing.md,
  },
  datePickerWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#020617',
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
