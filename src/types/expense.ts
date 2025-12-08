
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
  date: string;     
  createdAt: string; 
}
