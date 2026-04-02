using ExpensesTracker.Api.Dtos;
using ExpensesTracker.Api.Models;
using ExpensesTracker.Api.Repositories;

namespace ExpensesTracker.Api.Services;

public class ExpenseService : IExpenseService
{
    private readonly IExpenseRepository _repo;

    public ExpenseService(IExpenseRepository repo)
    {
        _repo = repo;
    }

    public async Task<ExpenseDto> CreateAsync(CreateExpenseRequest request)
    {
        var expense = new Expense
        {
            Date = request.Date,
            Amount = request.Amount,
            Description = request.Description,
            Category = request.Category
        };
        var created = await _repo.CreateAsync(expense);
        return ToDto(created);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repo.DeleteAsync(id);
    }

    public async Task<List<ExpenseDto>> GetAllAsync()
    {
        return (await _repo.GetAllAsync()).Select(ToDto).ToList();
    }

    public async Task<ExpenseDto?> GetByIdAsync(int id)
    {
        var expense = await _repo.GetByIdAsync(id);
        return expense is null ? null : ToDto(expense);
    }

    public async Task<bool> UpdateAsync(int id, UpdateExpenseRequest request)
    {
        var expense = new Expense
        {
            Id = id,
            Date = request.Date,
            Amount = request.Amount,
            Description = request.Description,
            Category = request.Category
        };
        return await _repo.UpdateAsync(expense);
    }

    private static ExpenseDto ToDto(Expense e) => new ExpenseDto
    {
        Id = e.Id,
        Date = e.Date,
        Amount = e.Amount,
        Description = e.Description,
        Category = e.Category
    };
}
