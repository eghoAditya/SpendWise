import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Expense, ExpenseCategory } from '../types/expense';

type NewExpenseInput = {
  amount: number;
  category: ExpenseCategory;
  note?: string;
  date: string;
};

type ExpensesContextValue = {
  expenses: Expense[];
  addExpense: (input: NewExpenseInput) => void;
  deleteExpense: (id: string) => void;
  budget: number;
  updateBudget: (value: number) => void;
  isHydrated: boolean;
};

const STORAGE_EXPENSES_KEY = '@spendwise/expenses';
const STORAGE_BUDGET_KEY = '@spendwise/budget';

const ExpensesContext =
  createContext<ExpensesContextValue | undefined>(
    undefined
  );

export const ExpensesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<number>(60000);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [[, rawExpenses], [, rawBudget]] =
          await AsyncStorage.multiGet([
            STORAGE_EXPENSES_KEY,
            STORAGE_BUDGET_KEY,
          ]);

        if (rawExpenses) {
          setExpenses(JSON.parse(rawExpenses));
        }

        if (rawBudget) {
          const parsedBudget = Number(
            JSON.parse(rawBudget)
          );
          if (!isNaN(parsedBudget) && parsedBudget > 0) {
            setBudget(parsedBudget);
          }
        }
      } catch (err) {
        console.warn('Failed to load SpendWise data', err);
      } finally {
        setIsHydrated(true);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(
      STORAGE_EXPENSES_KEY,
      JSON.stringify(expenses)
    ).catch(() => {});
  }, [expenses, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(
      STORAGE_BUDGET_KEY,
      JSON.stringify(budget)
    ).catch(() => {});
  }, [budget, isHydrated]);

  const addExpense = (input: NewExpenseInput) => {
    const now = new Date().toISOString();

    const expense: Expense = {
      id: `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`,
      amount: input.amount,
      category: input.category,
      note: input.note?.trim() || undefined,
      date: input.date,
      createdAt: now,
    };

    setExpenses((prev) => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) =>
      prev.filter((e) => e.id !== id)
    );
  };

  const updateBudget = (value: number) => {
    setBudget(value);
  };

  const value = useMemo(
    () => ({
      expenses,
      addExpense,
      deleteExpense,
      budget,
      updateBudget,
      isHydrated,
    }),
    [expenses, budget, isHydrated]
  );

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = (): ExpensesContextValue => {
  const ctx = useContext(ExpensesContext);
  if (!ctx) {
    throw new Error(
      'useExpenses must be used within an ExpensesProvider'
    );
  }
  return ctx;
};
