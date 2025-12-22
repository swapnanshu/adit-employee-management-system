# Employee Service

Employee microservice for the Office Management System. Manages employee records with inter-service communication to validate Company and Role references.

## 🎯 Service Responsibility

This service handles all employee-related operations including:
- CRUD operations for employees
- Inter-service validation of company and role references
- Email uniqueness enforcement
- Employee-company relationship management

## 🛠️ Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.x
- **Database**: MySQL 8.0+ with mysql2 (promise-based)
- **Validation**: Joi
- **Inter-service Communication**: Axios
- **UUID Generation**: uuid v4

## 📊 Database Schema

### Employees Table

```sql
CREATE TABLE employees (
  id CHAR(36) PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  company_id CHAR(36) NOT NULL,
  role_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_company_id (company_id),
  INDEX idx_role_id (role_id),
  INDEX idx_email (email)
);
```

**Fields:**
- `id`: UUID primary key
- `first_name`: Employee first name (2-50 characters)
- `last_name`: Employee last name (2-50 characters)
- `email`: Unique email address
- `company_id`: Foreign key reference to Company Service
- `role_id`: Foreign key reference to Role Service
- `created_at`: Auto-generated timestamp
- `updated_at`: Auto-updated timestamp

## 🚀 Local Development Setup

### Prerequisites

- Node.js 20+
- MySQL 8.0+ running locally or PlanetScale account

### Installation

1. **Navigate to service directory:**
   ```bash
   cd backend/employee-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=3002
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=employee_db
   COMPANY_SERVICE_URL=http://localhost:3001/api/v1
   ROLE_SERVICE_URL=http://localhost:3003/api/v1
   ```

4. **Create database:**
   ```sql
   CREATE DATABASE employee_db;
   USE employee_db;
   -- Run schema from database/schemas/employees.sql
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

The service will start on `http://localhost:3002`

## 📡 API Endpoints

Base URL: `http://localhost:3002/api/v1`

### Health Check
```bash
GET /health
```

### Employee Endpoints

#### Get All Employees
```bash
GET /api/v1/employees?limit=100&offset=0

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 50,
    "limit": 100,
    "offset": 0,
    "hasMore": false
  }
}
```

#### Get Employee by ID
```bash
GET /api/v1/employees/:id

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "company_id": "company-uuid",
    "role_id": "role-uuid",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create Employee
```bash
POST /api/v1/employees
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "company_id": "valid-company-uuid",
  "role_id": "valid-role-uuid"
}

Response (201):
{
  "success": true,
  "message": "Employee created successfully",
  "data": {...}
}
```

**Inter-service Validation:**
- Validates `company_id` exists by calling Company Service
- Validates `role_id` exists by calling Role Service
- Implements graceful degradation if services are unavailable

#### Update Employee
```bash
PATCH /api/v1/employees/:id
Content-Type: application/json

{
  "first_name": "Jane",
  "email": "jane@example.com"
}

Response (200):
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {...}
}
```

#### Delete Employee
```bash
DELETE /api/v1/employees/:id

Response (200):
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

#### Get Employees by Company
```bash
GET /api/v1/employees/company/:companyId

Response:
{
  "success": true,
  "data": [...]
}
```

## 🔗 Inter-Service Dependencies

This service communicates with:

1. **Company Service** (`COMPANY_SERVICE_URL`)
   - Validates company existence before creating/updating employees
   - Endpoint: `GET /api/v1/companies/:id`

2. **Role Service** (`ROLE_SERVICE_URL`)
   - Validates role existence before creating/updating employees
   - Endpoint: `GET /api/v1/roles/:id`

**Resilience Pattern:**
- Implements graceful degradation if dependent services are unavailable
- Logs warnings but allows operation to proceed
- Includes retry logic with 1-second delay for transient failures

## 🧪 Testing with cURL

### Create an Employee
```bash
curl -X POST http://localhost:3002/api/v1/employees \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "company_id": "your-company-uuid",
    "role_id": "your-role-uuid"
  }'
```

### Get All Employees
```bash
curl http://localhost:3002/api/v1/employees
```

### Update Employee
```bash
curl -X PATCH http://localhost:3002/api/v1/employees/employee-uuid \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane"
  }'
```

### Delete Employee
```bash
curl -X DELETE http://localhost:3002/api/v1/employees/employee-uuid
```

## 📁 Project Structure

```
employee-service/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection pool
│   ├── models/
│   │   └── employee.model.js    # Employee data access layer
│   ├── services/
│   │   └── employee.service.js  # Business logic & inter-service calls
│   ├── controllers/
│   │   └── employee.controller.js # HTTP request handlers
│   ├── routes/
│   │   └── employee.routes.js   # Route definitions
│   ├── middleware/
│   │   ├── validation.middleware.js    # Joi validation
│   │   └── errorHandler.middleware.js  # Global error handler
│   ├── utils/
│   │   └── httpClient.js        # Axios instance for inter-service calls
│   └── app.js                   # Express app entry point
├── .env.example                 # Environment variables template
├── package.json
└── README.md
```

## 🌍 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3002 | No |
| `NODE_ENV` | Environment (development/production) | development | No |
| `DB_HOST` | MySQL host | localhost | Yes |
| `DB_USER` | MySQL username | root | Yes |
| `DB_PASSWORD` | MySQL password | - | Yes |
| `DB_NAME` | Database name | employee_db | Yes |
| `DB_PORT` | MySQL port | 3306 | No |
| `DB_CONNECTION_LIMIT` | Connection pool size | 10 | No |
| `COMPANY_SERVICE_URL` | Company Service base URL | - | Yes* |
| `ROLE_SERVICE_URL` | Role Service base URL | - | Yes* |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | * | No |
| `API_TIMEOUT` | Inter-service call timeout (ms) | 5000 | No |

*Required for production; gracefully degrades if not configured

## 🚢 Deployment to Render

1. **Push code to GitHub**

2. **Create Web Service on Render:**
   - Connect your GitHub repository
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables:**
   - Add all variables from `.env.example`
   - Update service URLs to deployed endpoints

4. **Health Check:**
   - Path: `/health`
   - Expected Status: 200

## ⚠️ Error Handling

The service handles:
- **400 Bad Request**: Validation errors, invalid references
- **404 Not Found**: Employee not found
- **409 Conflict**: Duplicate email, referenced row conflicts
- **500 Internal Server Error**: Database errors, unexpected errors
- **503 Service Unavailable**: Database connection issues
- **504 Gateway Timeout**: Database timeout

## 🔒 Security Considerations

**Current Implementation:**
- SQL injection prevention via prepared statements
- Input validation with Joi
- CORS configuration

**Production Requirements:**
- JWT authentication
- Rate limiting
- API key validation for inter-service calls
- Encrypted database connections (TLS/SSL)
- Environment-based secret management

## 📈 Scalability

**Horizontal Scaling:**
- Stateless service design
- Connection pooling for database efficiency
- Can run multiple instances behind load balancer

**Database Optimization:**
- Indexes on foreign keys and email
- Connection pool prevents connection exhaustion
- Prepared statements for query performance

## 🐛 Debugging

**Enable detailed logging:**
```env
NODE_ENV=development
```

**Check service health:**
```bash
curl http://localhost:3002/health
```

**View logs in development:**
```bash
npm run dev
```

## 📝 License

ISC
