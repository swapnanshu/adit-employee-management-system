# Company Service

Company microservice for the Office Management System. Manages company records and serves as a reference service for the Employee Service.

## 🎯 Service Responsibility

This service handles all company-related operations including:
- CRUD operations for companies
- Company name uniqueness enforcement
- Serving company validation requests from Employee Service

## 🛠️ Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.x
- **Database**: MySQL 8.0+ with mysql2 (promise-based)
- **Validation**: Joi
- **UUID Generation**: uuid v4

## 📊 Database Schema

### Companies Table

```sql
CREATE TABLE companies (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  industry VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);
```

**Fields:**
- `id`: UUID primary key
- `name`: Unique company name (2-100 characters)
- `industry`: Industry sector (2-50 characters)
- `created_at`: Auto-generated timestamp
- `updated_at`: Auto-updated timestamp

## 🚀 Local Development Setup

### Prerequisites

- Node.js 20+
- MySQL 8.0+ running locally or PlanetScale account

### Installation

1. **Navigate to service directory:**
   ```bash
   cd backend/company-service
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
   PORT=3001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=company_db
   ```

4. **Create database:**
   ```sql
   CREATE DATABASE company_db;
   USE company_db;
   -- Run schema from database/schemas/companies.sql
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

The service will start on `http://localhost:3001`

## 📡 API Endpoints

Base URL: `http://localhost:3001/api/v1`

### Health Check
```bash
GET /health
```

### Company Endpoints

#### Get All Companies
```bash
GET /api/v1/companies?limit=100&offset=0

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 25,
    "limit": 100,
    "offset": 0,
    "hasMore": false
  }
}
```

#### Get Company by ID
```bash
GET /api/v1/companies/:id

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Tech Corp",
    "industry": "Technology",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create Company
```bash
POST /api/v1/companies
Content-Type: application/json

{
  "name": "Tech Corp",
  "industry": "Technology"
}

Response (201):
{
  "success": true,
  "message": "Company created successfully",
  "data": {...}
}
```

#### Update Company
```bash
PATCH /api/v1/companies/:id
Content-Type: application/json

{
  "industry": "Software Development"
}

Response (200):
{
  "success": true,
  "message": "Company updated successfully",
  "data": {...}
}
```

#### Delete Company
```bash
DELETE /api/v1/companies/:id

Response (200):
{
  "success": true,
  "message": "Company deleted successfully"
}

Note: Will fail if employees reference this company (foreign key constraint)
```

## 🔗 Inter-Service Communication

This service is called by:

1. **Employee Service**
   - Validates company existence before creating/updating employees
   - Endpoint used: `GET /api/v1/companies/:id`

## 🧪 Testing with cURL

### Create a Company
```bash
curl -X POST http://localhost:3001/api/v1/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Corp",
    "industry": "Technology"
  }'
```

### Get All Companies
```bash
curl http://localhost:3001/api/v1/companies
```

### Get Company by ID
```bash
curl http://localhost:3001/api/v1/companies/company-uuid
```

### Update Company
```bash
curl -X PATCH http://localhost:3001/api/v1/companies/company-uuid \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "Software"
  }'
```

### Delete Company
```bash
curl -X DELETE http://localhost:3001/api/v1/companies/company-uuid
```

## 📁 Project Structure

```
company-service/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection pool
│   ├── models/
│   │   └── company.model.js     # Company data access layer
│   ├── services/
│   │   └── company.service.js   # Business logic
│   ├── controllers/
│   │   └── company.controller.js # HTTP request handlers
│   ├── routes/
│   │   └── company.routes.js    # Route definitions
│   ├── middleware/
│   │   ├── validation.middleware.js    # Joi validation
│   │   └── errorHandler.middleware.js  # Global error handler
│   └── app.js                   # Express app entry point
├── .env.example                 # Environment variables template
├── package.json
└── README.md
```

## 🌍 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3001 | No |
| `NODE_ENV` | Environment (development/production) | development | No |
| `DB_HOST` | MySQL host | localhost | Yes |
| `DB_USER` | MySQL username | root | Yes |
| `DB_PASSWORD` | MySQL password | - | Yes |
| `DB_NAME` | Database name | company_db | Yes |
| `DB_PORT` | MySQL port | 3306 | No |
| `DB_CONNECTION_LIMIT` | Connection pool size | 10 | No |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | * | No |

## 🚢 Deployment to Render

1. **Push code to GitHub**

2. **Create Web Service on Render:**
   - Connect your GitHub repository
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables:**
   - Add all variables from `.env.example`

4. **Health Check:**
   - Path: `/health`
   - Expected Status: 200

## ⚠️ Error Handling

The service handles:
- **400 Bad Request**: Validation errors
- **404 Not Found**: Company not found
- **409 Conflict**: Duplicate company name, referenced by employees
- **500 Internal Server Error**: Database errors
- **503 Service Unavailable**: Database connection issues

## 🔒 Security Considerations

**Current Implementation:**
- SQL injection prevention via prepared statements
- Input validation with Joi
- CORS configuration

**Production Requirements:**
- JWT authentication
- Rate limiting
- API key validation for inter-service calls
- TLS/SSL for database connections

## 📈 Scalability

**Horizontal Scaling:**
- Stateless service design
- Connection pooling
- Can run multiple instances

**Database Optimization:**
- Index on company name for fast lookups
- Connection pool prevents exhaustion
- Prepared statements for performance

## 📝 License

ISC
