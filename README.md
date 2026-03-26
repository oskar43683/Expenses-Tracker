# Expenses-Tracker

Simple starter template:
- ASP.NET Core Web API backend (in-memory CRUD)
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

- Expenses are stored in memory, so they reset when you restart the API.
- If you change the API port, update `src/app/services/expenses.service.ts` (`API_BASE_URL`).