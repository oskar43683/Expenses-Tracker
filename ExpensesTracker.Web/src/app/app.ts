import { Component, OnInit, Inject, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ExpensesService } from './services/expenses.service';
import type { CreateExpenseRequest, Expense, UpdateExpenseRequest } from './models/expense';

const THEME_STORAGE_KEY = 'expense-tracker-theme';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('Expense tracker');

  private static readonly MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ] as const;

  public readonly theme = signal<'light' | 'dark'>('dark');

  /** Shown in category field datalist; user can still type any value. */
  public readonly categorySuggestions: readonly string[] = [
    'Food',
    'Health',
    'Rent',
    'Electricity & water',
    'Transport',
    'Entertainment',
    'Shopping',
    'Insurance',
    'Subscriptions',
    'Education',
    'Family',
    'Other',
  ];

  public readonly monthChoices: ReadonlyArray<{ value: number; label: string }> = [
    { value: 0, label: 'All months' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  public expenses: Expense[] = [];
  public loading = false;
  public errorMessage: string | null = null;

  public filterYear = new Date().getFullYear();
  public filterMonth = 0;
  public filterDay = 0;

  public editingId: number | null = null;
  public formDate: string = new Date().toISOString().slice(0, 10);
  public formAmount: number = 0;
  public formDescription: string = '';
  public formCategory: string = '';
  highlightLast = false;
  deleteId: number | null = null;
  isDeleting = false;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly expensesService: ExpensesService,
  ) {}

  get yearChoices(): number[] {
    const set = new Set<number>();
    const cy = new Date().getFullYear();
    set.add(cy);
    set.add(this.filterYear);
    for (const e of this.expenses) {
      const y = parseInt(e.date.slice(0, 4), 10);
      if (!Number.isNaN(y)) set.add(y);
    }
    return [...set].sort((a, b) => b - a);
  }

  get dayChoices(): ReadonlyArray<{ value: number; label: string }> {
    const out: { value: number; label: string }[] = [{ value: 0, label: 'All days' }];
    if (this.filterMonth <= 0) return out;
    const n = new Date(this.filterYear, this.filterMonth, 0).getDate();
    for (let d = 1; d <= n; d++) {
      out.push({ value: d, label: String(d).padStart(2, '0') });
    }
    return out;
  }

  get filteredExpenses(): Expense[] {
    return this.expenses.filter((e) => this.expenseMatchesFilter(e.date));
  }

  async ngOnInit(): Promise<void> {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      this.theme.set(saved);
    }
    this.applyTheme(this.theme());
    await this.refresh();
  }

  public toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    this.applyTheme(next);
  }

  private applyTheme(t: 'light' | 'dark'): void {
    this.document.documentElement.setAttribute('data-theme', t);
  }

  public themeToggleLabel(): string {
    return this.theme() === 'dark' ? 'Light mode' : 'Dark mode';
  }

  public onFilterYearChange(): void {
    this.clampFilterDay();
  }

  public onFilterMonthChange(): void {
    if (this.filterMonth === 0) {
      this.filterDay = 0;
    } else {
      this.clampFilterDay();
    }
  }

  private clampFilterDay(): void {
    if (this.filterMonth <= 0 || this.filterDay === 0) return;
    const max = new Date(this.filterYear, this.filterMonth, 0).getDate();
    if (this.filterDay > max) this.filterDay = max;
  }

  private expenseMatchesFilter(iso: string): boolean {
    const parts = iso.split('-').map((p) => parseInt(p, 10));
    if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return false;
    const [y, m, d] = parts;
    if (y !== this.filterYear) return false;
    if (this.filterMonth > 0 && m !== this.filterMonth) return false;
    if (this.filterMonth > 0 && this.filterDay > 0 && d !== this.filterDay) return false;
    return true;
  }

  public formatExpenseDate(iso: string): string {
    const parts = iso.split('-');
    if (parts.length < 3) return iso;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d) || m < 1 || m > 12) return iso;
    const mon = App.MONTHS[m - 1];
    return `${String(d).padStart(2, '0')}/${mon}/${y}`;
  }

  public async refresh(): Promise<void> {
    this.loading = true;
    this.errorMessage = null;
    try {
      this.expenses = await firstValueFrom(this.expensesService.getAll());
    } catch {
      this.errorMessage = 'Failed to load expenses. Is the API running?';
    } finally {
      this.loading = false;
    }
  }

  public async submit(): Promise<void> {
    this.errorMessage = null;

    const amount = Number(this.formAmount);
    if (!this.formDate) {
      this.errorMessage = 'Please select a date.';
      return;
    }
    if (!Number.isFinite(amount)) {
      this.errorMessage = 'Amount must be a valid number.';
      return;
    }
    if (!this.formCategory.trim()) {
      this.errorMessage = 'Category is required.';
      return;
    }

    const request: CreateExpenseRequest = {
      date: this.formDate,
      amount,
      description: this.formDescription.trim() ? this.formDescription : undefined,
      category: this.formCategory.trim(),
    };

    this.loading = true;
    try {
      if (this.editingId === null) {
        await firstValueFrom(this.expensesService.create(request));
      } else {
        await firstValueFrom(this.expensesService.update(this.editingId, request as UpdateExpenseRequest));
      }
      this.cancelEdit();
      await this.refresh();
      this.highlightLast = true;
      setTimeout(() => {
      this.highlightLast = false;
      }, 1000);
      
    } catch {
      this.errorMessage = 'Save failed. Check the API response.';
    } finally {
      this.loading = false;
    }
  }

  public edit(expense: Expense): void {
    this.editingId = expense.id;
    this.formDate = expense.date;
    this.formAmount = expense.amount;
    this.formDescription = expense.description ?? '';
    this.formCategory = expense.category;
  }

  public cancelEdit(): void {
    this.editingId = null;
    this.formDate = new Date().toISOString().slice(0, 10);
    this.formAmount = 0;
    this.formDescription = '';
    this.formCategory = '';
  }

  public remove(id: number): void {
  this.deleteId = id;
}

public async confirmDelete(): Promise<void> {
  if (this.deleteId === null) return;

  this.isDeleting = true;
  this.errorMessage = null;

  try {
    await firstValueFrom(this.expensesService.delete(this.deleteId));
    await this.refresh();
  } catch {
    this.errorMessage = 'Delete failed.';
  } finally {
    this.isDeleting = false;
    this.deleteId = null;
  }
}
}
