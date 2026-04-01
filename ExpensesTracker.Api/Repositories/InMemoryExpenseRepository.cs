using ExpensesTracker.Api.Dtos;
using ExpensesTracker.Api.Models;

namespace ExpensesTracker.Api.Repositories;

public class InMemoryExpenseRepository : IExpenseRepository
{
    private readonly object _gate = new();
    private readonly List<Expense> _expenses;
    private int _nextId;

    public InMemoryExpenseRepository()
    {
        _expenses = new List<Expense>
        {
            new Expense
            {
                Id = 1,
                Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-2)),
                Amount = 12.50m,
                Description = "Coffee",
                Category = "Food"
            },
            new Expense
            {
                Id = 2,
                Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                Amount = 45.00m,
                Description = "Groceries",
                Category = "Food"
            }
        };

        _nextId = _expenses.Max(x => x.Id) + 1;
    }

    public Task<List<Expense>> GetAllAsync()
    {
        lock (_gate)
        {
            return Task.FromResult(_expenses.OrderByDescending(e => e.Date).ToList());
        }
    }

    public Task<Expense?> GetByIdAsync(int id)
    {
        lock (_gate)
        {
            return Task.FromResult(_expenses.FirstOrDefault(e => e.Id == id));
        }
    }

    public Task<Expense> CreateAsync(Expense expense)
    {
        lock (_gate)
        {
            expense.Id = _nextId++;
            _expenses.Add(expense);
            return Task.FromResult(expense);
        }
    }

    public Task<bool> UpdateAsync(Expense expense)
    {
        lock (_gate)
        {
            var idx = _expenses.FindIndex(e => e.Id == expense.Id);
            if (idx < 0) return Task.FromResult(false);
            _expenses[idx] = expense;
            return Task.FromResult(true);
        }
    }

    public Task<bool> DeleteAsync(int id)
    {
        lock (_gate)
        {
            var removed = _expenses.RemoveAll(e => e.Id == id) > 0;
            return Task.FromResult(removed);
        }
    }
}

