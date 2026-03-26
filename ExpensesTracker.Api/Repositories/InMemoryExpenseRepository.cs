using ExpensesTracker.Api.Dtos;

namespace ExpensesTracker.Api.Repositories;

public class InMemoryExpenseRepository : IExpenseRepository
{
    private readonly object _gate = new();
    private readonly List<ExpenseDto> _expenses;
    private int _nextId;

    public InMemoryExpenseRepository()
    {
        _expenses = new List<ExpenseDto>
        {
            new ExpenseDto
            {
                Id = 1,
                Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-2)),
                Amount = 12.50m,
                Description = "Coffee",
                Category = "Food"
            },
            new ExpenseDto
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

    public Task<List<ExpenseDto>> GetAllAsync()
    {
        lock (_gate)
        {
            // Return a copy so callers can't mutate internal state.
            return Task.FromResult(_expenses
                .OrderByDescending(e => e.Date)
                .Select(e => new ExpenseDto
                {
                    Id = e.Id,
                    Date = e.Date,
                    Amount = e.Amount,
                    Description = e.Description,
                    Category = e.Category
                })
                .ToList());
        }
    }

    public Task<ExpenseDto?> GetByIdAsync(int id)
    {
        lock (_gate)
        {
            var found = _expenses.FirstOrDefault(e => e.Id == id);
            return Task.FromResult(found is null
                ? null
                : new ExpenseDto
                {
                    Id = found.Id,
                    Date = found.Date,
                    Amount = found.Amount,
                    Description = found.Description,
                    Category = found.Category
                });
        }
    }

    public Task<ExpenseDto> CreateAsync(CreateExpenseRequest request)
    {
        lock (_gate)
        {
            var nowId = _nextId++;

            var created = new ExpenseDto
            {
                Id = nowId,
                Date = request.Date,
                Amount = request.Amount,
                Description = request.Description,
                Category = request.Category
            };

            _expenses.Add(created);
            return Task.FromResult(created);
        }
    }

    public Task<bool> UpdateAsync(int id, UpdateExpenseRequest request)
    {
        lock (_gate)
        {
            var idx = _expenses.FindIndex(e => e.Id == id);
            if (idx < 0) return Task.FromResult(false);

            _expenses[idx] = new ExpenseDto
            {
                Id = id,
                Date = request.Date,
                Amount = request.Amount,
                Description = request.Description,
                Category = request.Category
            };

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

