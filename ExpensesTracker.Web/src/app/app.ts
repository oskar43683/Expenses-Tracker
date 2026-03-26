import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ExpensesService } from './services/expenses.service';
import type { CreateExpenseRequest, Expense, UpdateExpenseRequest } from './models/expense';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('ExpensesTracker.Web');

  public expenses: Expense[] = [];
  public loading = false;
  public errorMessage: string | null = null;

  public editingId: number | null = null;
  public formDate: string = new Date().toISOString().slice(0, 10);
  public formAmount: number = 0;
  public formDescription: string = '';
  public formCategory: string = 'Food';

  constructor(private readonly expensesService: ExpensesService) {}

  async ngOnInit(): Promise<void> {
    await this.refresh();
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
      this.cancelEdit(); // resets form + editing state
      await this.refresh();
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
    this.formCategory = 'Food';
  }

  public async remove(id: number): Promise<void> {
    if (!confirm('Delete this expense?')) return;

    this.loading = true;
    this.errorMessage = null;
    try {
      await firstValueFrom(this.expensesService.delete(id));
      await this.refresh();
    } catch {
      this.errorMessage = 'Delete failed.';
    } finally {
      this.loading = false;
    }
  }
}
