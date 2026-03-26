export type Expense = {
  id: number;
  date: string; // YYYY-MM-DD
  amount: number;
  description?: string;
  category: string;
};

export type CreateExpenseRequest = {
  date: string; // YYYY-MM-DD
  amount: number;
  description?: string;
  category: string;
};

export type UpdateExpenseRequest = CreateExpenseRequest;

