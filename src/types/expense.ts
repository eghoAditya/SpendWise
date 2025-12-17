export type ExpenseCategory =
  // Essential
  | 'rent'
  | 'fuel'
  | 'bills'
  | 'grocery'
  | 'transport'
  | 'pet_supplies'

  // Non-essential
  | 'food'
  | 'fun'
  | 'shopping'
  | 'party'
  | 'movies'
  | 'entertainment'

  // Fallback
  | 'other';

export type ExpenseCategoryType = 'essential' | 'non_essential';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note?: string;
  date: string;      // YYYY-MM-DD
  createdAt: string; // ISO timestamp
}
