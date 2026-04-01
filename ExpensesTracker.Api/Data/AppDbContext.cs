using Microsoft.EntityFrameworkCore;
using ExpensesTracker.Api.Models;

namespace ExpensesTracker.Api.Data;

using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<Expense> Expenses => Set<Expense>();

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    // This method is optional, but it's where you configure things like decimal precision
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Expense>()
            .Property(e => e.Amount)
            .HasPrecision(18, 2); // fixes EF Core warning
    }
}
