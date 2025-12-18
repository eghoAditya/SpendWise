import { spacing } from '@/src/theme/spaces';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { useMemo, useState } from 'react';
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


const ESSENTIAL_CATEGORIES = [
  { key: 'rent', label: 'Rent', icon: 'home-outline' },
  { key: 'fuel', label: 'Fuel', icon: 'car-outline' },
  { key: 'bills', label: 'Bills', icon: 'flash-outline' },
  { key: 'grocery', label: 'Grocery', icon: 'cart-outline' },
  { key: 'transport', label: 'Transport', icon: 'bus-outline' },
  { key: 'pet_supplies', label: 'Pet Supplies', icon: 'paw-outline' },
] as const;

const NON_ESSENTIAL_CATEGORIES = [
  { key: 'food', label: 'Food', icon: 'fast-food-outline' },
  { key: 'fun', label: 'Fun', icon: 'game-controller-outline' },
  { key: 'shopping', label: 'Shopping', icon: 'bag-handle-outline' },
  { key: 'party', label: 'Party', icon: 'wine-outline' },
  { key: 'movies', label: 'Movies', icon: 'film-outline' },
  { key: 'other', label: 'other', icon: 'layers-outline' },

] as const;

type ExpenseTypeUI = 'essential' | 'non_essential';

export default function AddExpenseScreen() {
  const { addExpense } = useExpenses();

  const [amount, setAmount] = useState('');
  const [expenseType, setExpenseType] =
    useState<ExpenseTypeUI>('essential');
  const [category, setCategory] =
    useState<ExpenseCategory>('rent');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const parsedAmount = parseFloat(amount.replace(/,/g, '.'));
  const amountIsValid = !isNaN(parsedAmount) && parsedAmount > 0;
  const formIsValid = amountIsValid && !!category;

  const dateISO = selectedDate.toISOString().slice(0, 10);

  const categories = useMemo(
    () =>
      expenseType === 'essential'
        ? ESSENTIAL_CATEGORIES
        : NON_ESSENTIAL_CATEGORIES,
    [expenseType]
  );

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
      setExpenseType('essential');
      setCategory('rent');
      setTouched(false);
      setSelectedDate(new Date());
    }, 300);
  };

  const openDatePicker = () => {
    if (Platform.OS === 'web') {
      const input = window.prompt(
        'Enter date as YYYY-MM-DD',
        dateISO
      );
      if (!input) return;
      const parsed = new Date(input);
      if (!isNaN(parsed.getTime())) setSelectedDate(parsed);
      return;
    }
    setIsDatePickerOpen(true);
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    date?: Date
  ) => {
    if (event.type === 'set' && date) setSelectedDate(date);
    if (Platform.OS === 'android') setIsDatePickerOpen(false);
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Add expense</Text>
            <Ionicons
              name="wallet-outline"
              size={22}
              color={colors.accent}
            />
          </View>

          <Card>
            {/* AMOUNT */}
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountRow}>
              <Text style={styles.currency}>₹</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                style={styles.amountInput}
                onBlur={() => setTouched(true)}
              />
            </View>

            {/* TYPE TOGGLE */}
            <Text style={[styles.label, { marginTop: spacing.lg }]}>
              Expense type
            </Text>
            <View style={styles.typeRow}>
              {(['essential', 'non_essential'] as const).map(
                (t) => {
                  const active = expenseType === t;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => {
                        setExpenseType(t);
                        setCategory(
                          t === 'essential' ? 'rent' : 'food'
                        );
                      }}
                      style={[
                        styles.typeButton,
                        active && styles.typeButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeText,
                          active && styles.typeTextActive,
                        ]}
                      >
                        {t === 'essential'
                          ? 'Essential'
                          : 'Non-Essential'}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>

            {/* CATEGORY GRID */}
            <Text style={[styles.label, { marginTop: spacing.lg }]}>
              Category
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((item) => {
                const active = item.key === category;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setCategory(item.key)}
                    style={{ minWidth: '45%' }}
                  >
                    <Card
                      style={[
                        styles.categoryCard,
                        active && styles.categoryCardActive,
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={
                          active
                            ? colors.accent
                            : colors.textSecondary
                        }
                      />
                      <Text
                        style={[
                          styles.categoryLabel,
                          active &&
                            styles.categoryLabelActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Card>
                  </Pressable>
                );
              })}
            </View>

            {/* DATE */}
            <Text style={[styles.label, { marginTop: spacing.lg }]}>
              Date
            </Text>
            <Pressable onPress={openDatePicker} style={styles.inlineRow}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.dateText}>
                {selectedDate.toDateString()}
              </Text>
            </Pressable>

            {/* NOTE */}
            <Text style={[styles.label, { marginTop: spacing.lg }]}>
              Note
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Optional note"
              style={styles.noteInput}
              multiline
            />

            <PrimaryButton
              label="Save expense"
              onPress={handleSubmit}
              loading={submitting}
              disabled={!formIsValid}
              style={{ marginTop: spacing.xl }}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {Platform.OS !== 'web' && isDatePickerOpen && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      )}
    </Screen>
  );
}

/* styles unchanged */



const styles = StyleSheet.create({
  scrollContent: { paddingBottom: spacing.xxl },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    borderColor: colors.borderSubtle,
  },
  currency: { fontSize: 18, marginRight: 4 },
  amountInput: {
    flex: 1,
    fontSize: 20,
    color: colors.textPrimary,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: colors.borderSubtle,
  },
  typeButtonActive: {
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderColor: colors.accent,
  },
  typeText: { color: colors.textSecondary },
  typeTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  categoryCardActive: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderColor: colors.accent,
  },
  categoryLabel: { color: colors.textSecondary },
  categoryLabelActive: {
    color: colors.accent,
    fontWeight: '500',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: { color: colors.textPrimary, fontSize: 13 },
  noteInput: {
    minHeight: 72,
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    borderColor: colors.borderSubtle,
    color: colors.textPrimary,
  },
});
