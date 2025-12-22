# Role Service

Role microservice for the Office Management System. Manages job role records and serves as a reference service for the Employee Service.

## 🎯 Service Responsibility

This service handles all role-related operations including:
- CRUD operations for job roles
- Role title uniqueness enforcement
- Serving role validation requests from Employee Service

## 🛠️ Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.x
- **Database**: MySQL 8.0+ with mysql2 (promise-based)
- **Validation**: Joi
- **UUID Generation**: uuid v4

## 📊 Database Schema

### Roles Table

```sql
CREATE TABLE roles (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_title (title)
);
```

**Fields:**
- `id`: UUID primary key
- `title`: Unique role title (2-50 characters)
- `description`: Role description (5-200 characters)
- `created_at`: Auto-generated timestamp
- `updated_at`: Auto-updated timestamp

## 🚀 Local Development Setup

### Prerequisites

- Node.js 20+
- MySQL 8.0+ running locally or PlanetScale account

### Installation

1. **Navigate to service directory:**
   ```bash
   cd backend/role-service
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
   PORT=3003
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=role_db
   ```

4. **Create database:**
   ```sql
   CREATE DATABASE role_db;
   USE role_db;
   -- Run schema from database/schemas/roles.sql
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

The service will start on `http://localhost:3003`

## 📡 API Endpoints

Base URL: `http://localhost:3003/api/v1`

### Health Check
```bash
GET /health
```

### Role Endpoints

#### Get All Roles
```bash
GET /api/v1/roles?limit=100&offset=0

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 10,
    "limit": 100,
    "offset": 0,
    "hasMore": false
  }
}
```

#### Get Role by ID
```bash
GET /api/v1/roles/:id

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Software Developer",
    "description": "Develops and maintains software applications",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create Role
```bash
POST /api/v1/roles
Content-Type: application/json

{
  "title": "Software Developer",
  "description": "Develops and maintains software applications"
}

Response (201):
{
  "success": true,
  "message": "Role created successfully",
  "data": {...}
}
```

#### Update Role
```bash
PATCH /api/v1/roles/:id
Content-Type: application/json

{
  "description": "Senior software developer role"
}

Response (200):
{
  "success": true,
  "message": "Role updated successfully",
  "data": {...}
}
```

#### Delete Role
```bash
DELETE /api/v1/roles/:id

Response (200):
{
  "success": true,
  "message": "Role deleted successfully"
}

Note: Will fail if employees reference this role (foreign key constraint)
```

## 🔗 Inter-Service Communication

This service is called by:

1. **Employee Service**
   - Validates role existence before creating/updating employees
   - Endpoint used: `GET /api/v1/roles/:id`

## 🧪 Testing with cURL

### Create a Role
```bash
curl -X POST http://localhost:3003/api/v1/roles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Developer",
    "description": "Develops and maintains software applications"
  }'
```

### Get All Roles
```bash
curl http://localhost:3003/api/v1/roles
```

### Get Role by ID
```bash
curl http://localhost:3003/api/v1/roles/role-uuid
```

### Update Role
```bash
curl -X PATCH http://localhost:3003/api/v1/roles/role-uuid \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Senior developer position"
  }'
```

### Delete Role
```bash
curl -X DELETE http://localhost:3003/api/v1/roles/role-uuid
```

## 📁 Project Structure

```
role-service/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection pool
│   ├── models/
│   │   └── role.model.js        # Role data access layer
│   ├── services/
│   │   └── role.service.js      # Business logic
│   ├── controllers/
│   │   └── role.controller.js   # HTTP request handlers
│   ├── routes/
│   │   └── role.routes.js       # Route definitions
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
| `PORT` | Server port | 3003 | No |
| `NODE_ENV` | Environment (development/production) | development | No |
| `DB_HOST` | MySQL host | localhost | Yes |
| `DB_USER` | MySQL username | root | Yes |
| `DB_PASSWORD` | MySQL password | - | Yes |
| `DB_NAME` | Database name | role_db | Yes |
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
- **404 Not Found**: Role not found
- **409 Conflict**: Duplicate role title, referenced by employees
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
- Index on role title for fast lookups
- Connection pool prevents exhaustion
- Prepared statements for performance

## 📝 License

ISC
