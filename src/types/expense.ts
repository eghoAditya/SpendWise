
export type ExpenseCategory =
  | 'food'
  | 'entertainment'
  | 'shopping'
  | 'fuel'
  | 'bills'
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note?: string;
  date: string;      // ISO date string, e.g. "2025-12-07"
  createdAt: string; // ISO date-time string
}
