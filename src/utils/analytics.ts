import { Expense, ExpenseCategory } from '../types/expense';

export type MonthlyExpenseSummary = {
  month: number;
  year: number;
  total: number;
  byCategory: Record<ExpenseCategory, number>;
};

export function getMonthlyExpenseSummary(
  expenses: Expense[],
  month: number,
  year: number
): MonthlyExpenseSummary {
  const filtered = expenses.filter((expense) => {
    const date = new Date(expense.date);
    return (
      date.getMonth() === month &&
      date.getFullYear() === year
    );
  });

  const byCategory: Record<ExpenseCategory, number> = {
    food: 0,
    entertainment: 0,
    shopping: 0,
    fuel: 0,
    bills: 0,
    other: 0,
  };

  let total = 0;

  filtered.forEach((expense) => {
    byCategory[expense.category] += expense.amount;
    total += expense.amount;
  });

  return {
    month,
    year,
    total,
    byCategory,
  };
}
