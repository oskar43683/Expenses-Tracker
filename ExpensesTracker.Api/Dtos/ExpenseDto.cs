namespace ExpensesTracker.Api.Dtos;

public class ExpenseDto
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
}

