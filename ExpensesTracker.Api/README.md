# Expenses-Tracker API

ASP.NET Core Web API backend for the ExpensesTracker project.

## Requirements

- .NET 8 SDK (or your project’s .NET version)
- SQL Server (local or remote)
- (Optional) [SSMS](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) to view/manage the database

## Run Backend
From the solution folder:

```bash
dotnet run --project ExpensesTracker.Api
```

Swagger UI: [http://localhost:5000/swagger](http://localhost:5000/swagger)

---

## Configuration
Check `appsettings.json` for the connection string:

```json
"ConnectionStrings": {
"DefaultConnection": "Server=localhost\\SQLExpress;Database=ExpensesTrackerDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
},
```

- Update this string if you are using a different SQL Server instance.
- EF Core will automatically create and manage the database tables.

---

## API Endpoints
Base URL: `http://localhost:5000/api`

| Method | Endpoint          | Description          |
|--------|-----------------|--------------------|
| GET    | /expense         | Get all expenses    |
| GET    | /expense/{id}    | Get expense by ID   |
| POST   | /expense         | Create a new expense|
| PUT    | /expense/{id}    | Update an expense   |
| DELETE | /expense/{id}    | Delete an expense   |

---

## Notes
- Expenses are stored in a **SQL Server database** via EF Core (`DbContext`).
- You can inspect or manage the database using **SSMS** if needed.
- Make sure the backend port (`5000`) matches your Angular frontend API base URL
"""