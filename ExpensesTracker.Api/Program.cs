using System.Text.Json.Serialization;
using ExpensesTracker.Api.Dtos;
using ExpensesTracker.Api.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Allow the Angular dev server to call this API.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Keep JSON property casing predictable for the frontend.
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

builder.Services.AddSingleton<IExpenseRepository, InMemoryExpenseRepository>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAngular");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var api = app.MapGroup("/api");

api.MapGet("/expenses", async (IExpenseRepository repo) => await repo.GetAllAsync())
   .WithName("GetExpenses")
   .WithOpenApi();

api.MapGet("/expenses/{id:int}", async (int id, IExpenseRepository repo) =>
{
    var expense = await repo.GetByIdAsync(id);
    return expense is null ? Results.NotFound() : Results.Ok(expense);
})
.WithName("GetExpenseById")
.WithOpenApi();

api.MapPost("/expenses", async (CreateExpenseRequest request, IExpenseRepository repo) =>
{
    var created = await repo.CreateAsync(request);
    return Results.Created($"/api/expenses/{created.Id}", created);
})
.WithName("CreateExpense")
.WithOpenApi();

api.MapPut("/expenses/{id:int}", async (int id, UpdateExpenseRequest request, IExpenseRepository repo) =>
{
    var updated = await repo.UpdateAsync(id, request);
    return updated ? Results.NoContent() : Results.NotFound();
})
.WithName("UpdateExpense")
.WithOpenApi();

api.MapDelete("/expenses/{id:int}", async (int id, IExpenseRepository repo) =>
{
    var deleted = await repo.DeleteAsync(id);
    return deleted ? Results.NoContent() : Results.NotFound();
})
.WithName("DeleteExpense")
.WithOpenApi();

app.MapGet("/", () => "Expenses Tracker API is running.");

app.Run();
