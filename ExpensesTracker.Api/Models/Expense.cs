namespace ExpensesTracker.Api.Models;

public class Expense
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
}
