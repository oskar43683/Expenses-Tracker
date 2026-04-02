# Expenses-Tracker

Simple starter template:
- ASP.NET Core Web API backend (CRUD with SQL Server / EF Core)
- Angular frontend (CRUD UI)

## Run

### 1) Backend (.NET)

From the solution folder:

`dotnet run --project ExpensesTracker.Api`

Swagger: `http://localhost:5000/swagger`

### 2) Frontend (Angular)

In `ExpensesTracker.Web`:

`npm start`

App: `http://localhost:4200`

## API (in-memory)

Base: `http://localhost:5000/api`

- `GET /expenses`
- `GET /expenses/{id}`
- `POST /expenses`
- `PUT /expenses/{id}`
- `DELETE /expenses/{id}`

## Notes

- Expenses are stored in a SQL Server database using EF Core (DbContext).
- You can inspect or manage the database using SSMS (SQL Server Management Studio) if needed.
- Make sure the connection string in appsettings.json matches your local SQL Server instance.
- If you change the API port, update `src/app/services/expenses.service.ts` (`API_BASE_URL`).