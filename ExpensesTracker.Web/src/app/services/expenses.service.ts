import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { CreateExpenseRequest, Expense, UpdateExpenseRequest } from '../models/expense';

const API_BASE_URL = 'http://localhost:5000';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${API_BASE_URL}/api/expenses`);
  }

  create(request: CreateExpenseRequest): Observable<Expense> {
    return this.http.post<Expense>(`${API_BASE_URL}/api/expenses`, request);
  }

  update(id: number, request: UpdateExpenseRequest): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/api/expenses/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/api/expenses/${id}`);
  }
}

