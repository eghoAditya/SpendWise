import { Expense, ExpenseCategory } from '../types/expense';
import { CATEGORY_TYPE_MAP } from './categoryConfig';


function createEmptyCategoryTotals(): Record<ExpenseCategory, number> {
  return Object.keys(CATEGORY_TYPE_MAP).reduce((acc, key) => {
    acc[key as ExpenseCategory] = 0;
    return acc;
  }, {} as Record<ExpenseCategory, number>);
}


export function getCategoryTotals(expenses: Expense[]) {
  const totals = createEmptyCategoryTotals();

  expenses.forEach((e) => {
    totals[e.category] += e.amount;
  });

  return totals;
}


export function getEssentialSplitTotals(expenses: Expense[]) {
  let essentialTotal = 0;
  let nonEssentialTotal = 0;

  expenses.forEach((e) => {
    const type = CATEGORY_TYPE_MAP[e.category];
    if (type === 'essential') {
      essentialTotal += e.amount;
    } else {
      nonEssentialTotal += e.amount;
    }
  });

  return {
    essentialTotal,
    nonEssentialTotal,
  };
}
