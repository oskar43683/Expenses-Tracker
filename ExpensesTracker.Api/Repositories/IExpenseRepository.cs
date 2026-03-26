using ExpensesTracker.Api.Dtos;

namespace ExpensesTracker.Api.Repositories;

public interface IExpenseRepository
{
    Task<List<ExpenseDto>> GetAllAsync();
    Task<ExpenseDto?> GetByIdAsync(int id);
    Task<ExpenseDto> CreateAsync(CreateExpenseRequest request);
    Task<bool> UpdateAsync(int id, UpdateExpenseRequest request);
    Task<bool> DeleteAsync(int id);
}

