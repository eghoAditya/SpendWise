import { ExpenseCategory } from '../types/expense';

export const CATEGORY_TYPE: Record<
  ExpenseCategory,
  'essential' | 'non-essential'
> = {
  // Essential
  rent: 'essential',
  fuel: 'essential',
  bills: 'essential',
  grocery: 'essential',
  transport: 'essential',
  pet_supplies: 'essential',

  // Non-essential
  food: 'non-essential',
  fun: 'non-essential',
  shopping: 'non-essential',
  party: 'non-essential',
  movies: 'non-essential',
  other: 'non-essential',
};

export const isEssentialCategory = (category: ExpenseCategory) =>
  CATEGORY_TYPE[category] === 'essential';

export const isNonEssentialCategory = (category: ExpenseCategory) =>
  CATEGORY_TYPE[category] === 'non-essential';
