import { Expense } from '../types/expense';
import { CATEGORY_TYPE } from './categoryConfig';

export function splitExpensesByType(expenses: Expense[]) {
  const essential: Expense[] = [];
  const nonEssential: Expense[] = [];

  expenses.forEach((e) => {
    const type = CATEGORY_TYPE[e.category];
    if (type === 'essential') {
      essential.push(e);
    } else {
      nonEssential.push(e);
    }
  });

  return { essential, nonEssential };
}

export function sumExpenses(expenses: Expense[]) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}
