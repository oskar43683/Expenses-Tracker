using ExpensesTracker.Api.Data;
using ExpensesTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpensesTracker.Api.Repositories;

public class ExpenseRepository : IExpenseRepository
{
private readonly AppDbContext _context;

    public ExpenseRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Expense>> GetAllAsync() =>
        await _context.Expenses.OrderByDescending(e => e.Date).ToListAsync();

    public async Task<Expense?> GetByIdAsync(int id) =>
        await _context.Expenses.FindAsync(id);

    public async Task<Expense> CreateAsync(Expense expense)
    {
        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();
        return expense;
    }

    public async Task<bool> UpdateAsync(Expense expense)
    {
        var existing = await _context.Expenses.FindAsync(expense.Id);
        if (existing == null) return false;

        _context.Entry(existing).CurrentValues.SetValues(expense);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Expenses.FindAsync(id);
        if (existing == null) return false;

        _context.Expenses.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}

