# Office Management System - Architecture Document

This document explains the architectural decisions, patterns, and design rationale for the Office Management System built for a Senior Software Developer interview assignment.

---

## 📐 System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Angular Shell (Module Federation Host)      │   │
│  │  ┌────────────────┐        ┌────────────────┐        │   │
│  │  │  Employee MFE  │        │  Company MFE   │       │   │
│  │  │   (Angular)    │        │    (React)     │       │   │
│  │  └────────┬───────┘        └────────┬───────┘        │   │
│  └───────────┼──────────────────────────┼────────────────┘   │
└──────────────┼──────────────────────────┼────────────────────┘
               │                          │
          HTTP │API Calls            HTTP │API Calls
               │                          │
┌──────────────▼──────────────────────────▼────────────────────┐
│                   Backend Layer (Microservices)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Employee   │  │   Company    │  │     Role     │       │
│  │   Service    │  │   Service    │  │   Service    │       │
│  │  Port: 3002  │  │  Port: 3001  │  │  Port: 3003  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                  │               │
│         │  Inter-Service   │                  │               │
│         │  HTTP Calls      │                  │               │
│         └──────────────────┘                  │               │
└────────────────┬────────────────────┬─────────┴───────────────┘
                 │                    │                 │
            HTTP │                HTTP│            HTTP │
                 │                    │                 │
┌────────────────▼────────────────────▼─────────────────▼───────┐
│                    Data Layer (MySQL 8.0+)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  employee_db │  │  company_db  │  │   role_db    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Microfrontend Architecture

### Why Module Federation?

**Decision:** Use Webpack Module Federation for runtime microfrontend integration

**Alternatives Considered:**
1. **iframe-based** - Isolated but poor UX, styling challenges, complex communication
2. **single-spa** - Good framework but adds abstraction layer
3. **Web Components** - Browser-native but limited framework support
4. **Build-time composition** - No true independence, monolithic deployment

**Module Federation Advantages:**
- ✅ Runtime integration (truly independent deployment)
- ✅ Shared dependencies (React, Angular libs loaded once)
- ✅ Framework agnostic (Angular + React in same app)
- ✅ True versioning independence
- ✅ Performance optimization (code splitting, lazy loading)

**Trade-offs:**
- ⚠️ Complexity in initial setup
- ⚠️ Version management for shared dependencies
- ⚠️ Browser compatibility (needs modern browsers)

### Shell Application Responsibility

The **Angular Shell** acts as the host/container:

**Responsibilities:**
- Global layout (header, navigation, footer)
- Authentication placeholder (future)
- Routing to microfrontends
- Shared state management (if needed)
- Loading remote modules at runtime

**Why Angular for Shell?**
- Strong routing capabilities
- Dependency injection for shared services
- Mature ecosystem
- Required by assignment (at least one Angular MFE)

### Microfrontend Communication

**Pattern:** Event Bus + Shared Services

```typescript
// Shared Angular service for cross-MFE communication
@Injectable({ providedIn: 'root' })
export class GlobalEventService {
  private subject = new Subject<any>();
  
  emit(event: any) {
    this.subject.next(event);
  }
  
  on(): Observable<any> {
    return this.subject.asObservable();
  }
}
```

**Alternative Approaches:**
- Custom Events (browser native)
- LocalStorage/SessionStorage
- Shared state library (Redux, MobX)

**Chosen Approach:** Minimal communication for now (each MFE is mostly independent)

---

## 🔧 Microservices Architecture

### Service Decomposition Strategy

**Domain-Driven Design (DDD) Approach:**

1. **Company Service** - Bounded Context: Company Management
   - Core Domain: Company entity lifecycle
   - Capabilities: CRUD operations, company validation
   - No dependencies on other services
   - Serves as reference data for Employee Service

2. **Role Service** - Bounded Context: Role Management
   - Core Domain: Job role definitions
   - Capabilities: CRUD operations, role validation
   - No dependencies on other services
   - Serves as reference data for Employee Service

3. **Employee Service** - Bounded Context: Employee Management
   - Core Domain: Employee entity with relationships
   - Capabilities: CRUD operations, relationship validation
   - Dependencies: Company Service, Role Service
   - Orchestrates validation across services

**Why Three Separate Services?**

✅ **Benefits:**
- Each service has distinct lifecycle and ownership potential
- Independent scaling (Employee service likely sees more traffic)
- Technology flexibility (could use different languages)
- Team autonomy (different teams can own services)
- Failure isolation (Company Service down doesn't break Role Service)

⚠️ **Trade-offs:**
- Increased operational complexity
- Network latency for service-to-service calls
- No ACID transactions across services
- More complex deployment orchestration

**When Would a Monolith Be Better?**
- Team size < 5 developers
- Simple domain without clear bounded contexts
- Performance critical (no network hops)
- Early-stage startup with rapidly changing requirements

---

## 🔗 Inter-Service Communication

### Synchronous HTTP Pattern

**Design Decision:** Use REST over HTTP for inter-service calls

**Implementation:**
```javascript
// Employee Service validates company existence
const response = await httpClient.get(
  `${COMPANY_SERVICE_URL}/api/v1/companies/${companyId}`
);

if (response.status === 200) {
  // Company exists, proceed with employee creation
}
```

**Why Synchronous REST?**
- ✅ Immediate feedback (knows if company exists before inserting)
- ✅ Simplicity (no message broker needed)
- ✅ Request-response pattern familiar to developers
- ✅ Appropriate for validation use case

**Alternatives Considered:**

1. **Asynchronous Messaging (RabbitMQ, Kafka)**
   - Better for event-driven workflows
   - Overkill for simple validation
   - Adds infrastructure complexity
   - Eventual consistency challenges

2. **GraphQL Federation**
   - Excellent for client querying
   - Adds complexity for service-to-service
   - Schema stitching overhead

3. **gRPC**
   - Better performance than REST
   - Requires Protocol Buffers knowledge
   - Less HTTP-friendly for demo/debugging

### Resilience Patterns

**Current Implementation:**

1. **Retry Logic:**
```javascript
// Automatic retry on transient failures
if (!error.response || error.response.status >= 500) {
  return httpClient(originalRequest); // Retry once
}
```

2. **Graceful Degradation:**
```javascript
// If service unavailable, log warning but allow operation (demo mode)
console.warn('Service unavailable, proceeding without validation');
return true;
```

**Production Additions Needed:**

1. **Circuit Breaker Pattern:**
   - Detect repeated failures
   - Open circuit to fail fast
   - Periodic health checks to close circuit
   - Library: `opossum`

2. **Timeout Configuration:**
   - ✅ Already implemented (5-second timeout)
   - Prevents hanging requests

3. **Bulkhead Pattern:**
   - Isolate thread pools per dependency
   - Prevents cascading failures

4. **Service Mesh (Istio/Linkerd):**
   - Traffic management
   - Mutual TLS
   - Observability
   - Retry/timeout at infrastructure level

### API Versioning

**Current:** `/api/v1/*`

**Strategy:** URL versioning for simplicity

**Future Options:**
- Header versioning (`Accept: application/vnd.api+json; version=1`)
- Semantic versioning for breaking changes

---

## 🗄️ Database Architecture

### Database Per Service Pattern

**Design Decision:** Separate MySQL database for each service

```
company_db  ← Company Service
role_db     ← Role Service
employee_db ← Employee Service
```

**Why Separate Databases?**

✅ **Benefits:**
- Data encapsulation (service owns its data)
- Independent schema evolution
- Different database technologies possible (MySQL → PostgreSQL)
- Scalability (separate read replicas per service)
- Failure isolation

⚠️ **Trade-offs:**
- No foreign key constraints across services
- No cross-service transactions (no ACID)
- More complex data consistency management
- Multiple database instances to manage

**Alternative:** Shared Database with Schemas

```sql
-- Single MySQL instance, multiple schemas
CREATE DATABASE office_management;
USE office_management;

CREATE TABLE companies (...);
CREATE TABLE roles (...);
CREATE TABLE employees (...);
```

**Why Not Chosen:**
- Couples services at data layer
- Harder to scale independently
- Schema migrations affect all services
- Defeats microservices purpose

### Foreign Key Handling

**Challenge:** `employees.company_id` references `companies.id` in different database

**Solution:** Application-level enforcement

```javascript
// Instead of database FK constraint...
ALTER TABLE employees 
  ADD CONSTRAINT fk_company 
  FOREIGN KEY (company_id) REFERENCES companies(id);

// We validate in code via HTTP call
const company = await companyService.getById(companyId);
if (!company) {
  throw new Error('Company does not exist');
}
```

**Trade-offs:**
- ✅ Service independence maintained
- ✅ Allows distributed database deployment
- ⚠️ Referential integrity not guaranteed at DB level
- ⚠️ Orphaned records possible if validation skipped
- ⚠️ Performance overhead (network call)

**Mitigation Strategies:**
1. Comprehensive validation in service layer
2. Background jobs to detect orphaned records
3. Event-driven sync (publish CompanyDeleted event)

### Connection Pooling

**Configuration:**
```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  connectionLimit: 10,  // Max 10 concurrent connections
  waitForConnections: true,
  queueLimit: 0  // Unlimited queue
});
```

**Why Connection Pooling?**
- ✅ Reuses connections (avoid setup/teardown overhead)
- ✅ Limits concurrent connections (prevents DB overload)
- ✅ Better performance under load

**Free Tier Considerations:**
- PlanetScale: Unlimited connections (serverless)
- Railway: Connection limit depends on instance
- Configured to 10 for local MySQL

### Primary Key Strategy

**Decision:** Use UUID v4 for all primary keys

```javascript
const { v4: uuidv4 } = require('uuid');
const id = uuidv4(); // e.g., '550e8400-e29b-41d4-a716-446655440001'
```

**Why UUIDs over Auto-Increment?**

✅ **Benefits:**
- Globally unique (no collision across services/databases)
- Generated at application layer (no DB round-trip)
- Mergeable databases (no ID conflicts)
- Distributed system friendly
- Obscures total record count from clients

⚠️ **Trade-offs:**
- 36 characters vs 4-8 bytes (storage overhead)
- Slower index performance than sequential integers
- Non-human-readable

**Alternative:** Snowflake IDs, ULID (time-sortable UUIDs)

---

## 🔒 Security Architecture

### Current Implementation (Demo Scope)

✅ **Implemented:**

1. **SQL Injection Prevention:**
```javascript
// Prepared statements with parameterized queries
const [rows] = await pool.execute(
  'SELECT * FROM employees WHERE id = ?',
  [id]  // Parameters escaped by driver
);
```

2. **Input Validation:**
```javascript
// Joi schema validation
const schema = Joi.object({
  email: Joi.string().email().required(),
  first_name: Joi.string().min(2).max(50).required()
});
```

3. **CORS Configuration:**
```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN.split(','),
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
};
```

4. **Environment-based Configuration:**
```javascript
// Secrets in environment variables, not code
const DB_PASSWORD = process.env.DB_PASSWORD;
```

### Production Requirements (Not Implemented)

❌ **Missing (Out of Scope for Interview):**

1. **Authentication & Authorization:**
   - JWT token-based auth
   - OAuth 2.0 / OpenID Connect
   - Role-based access control (RBAC)
   - API gateway for centralized auth

**How It Would Work:**
```
Client → API Gateway → Validate JWT → Forward to Service
                          ↓
                     Auth Service
```

2. **API Security:**
   - Rate limiting (express-rate-limit)
   - API keys for service-to-service calls
   - Request signing (HMAC)

```javascript
// Service-to-service API key
headers: {
  'X-API-Key': process.env.INTERNAL_API_KEY
}
```

3. **Data Security:**
   - TLS/SSL for all connections
   - Database connection encryption
   - Secrets management (AWS Secrets Manager, Vault)
   - Data encryption at rest

4. **Monitoring & Auditing:**
   - Access logs
   - Audit trail for data changes
   - Security event alerting

### Why Use API Gateway in Production?

```
                  ┌─────────────────┐
                  │   API Gateway   │
                  │                 │
                  │  - Auth         │
                  │  - Rate Limit   │
                 │  - Routing      │
                  │  - Logging      │
                  └────────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐        ┌────▼────┐       ┌────▼────┐
   │Employee │        │ Company │       │  Role   │
   │ Service │        │ Service │       │ Service │
   └─────────┘        └─────────┘       └─────────┘
```

**Benefits:**
- Centralized authentication
- Single entry point for clients
- Cross-cutting concerns (logging, rate limiting)
- Backend for Frontend (BFF) pattern

**Options:** Kong, AWS API Gateway, Nginx, Traefik

---

## 📈 Scalability & Performance

### Horizontal Scaling Strategy

**Current Architecture Benefits:**

✅ **Stateless Services:**
- No session state (all data in DB or request)
- Can run multiple instances safely
- Load balancer distributes requests

```
         Load Balancer
              ↓
    ┌─────────┼─────────┐
    ↓         ↓         ↓
Company   Company   Company
Instance  Instance  Instance
   #1        #2        #3
```

✅ **Independent Scaling:**
- Scale Company Service to 2 instances
- Scale Employee Service to 5 instances (high load)
- Scale Role Service to 1 instance (low load)

### Database Scaling

**Current:** Single MySQL instance per service

**Future Scaling:**

1. **Vertical Scaling:**
   - Increase CPU/RAM
   - Fastest short-term solution
   - Limited by hardware

2. **Read Replicas:**
```
Company Service
    ↓
Primary DB (writes) → Replica 1 (reads)
                   → Replica 2 (reads)
```

   - Offload GET requests to replicas
   - Primary handles writes
   - Eventual consistency

3. **Database Sharding:**
   - Partition employee data by company_id
   - Shard 1: Companies A-M
   - Shard 2: Companies N-Z
   - Requires query routing logic

### Caching Strategy

**Not Implemented (Future Enhancement):**

1. **Application-Level Cache:**
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache company lookups
async function getCompany(id) {
  const cached = await client.get(`company:${id}`);
  if (cached) return JSON.parse(cached);
  
  const company = await CompanyModel.findById(id);
  await client.setEx(`company:${id}`, 3600, JSON.stringify(company));
  return company;
}
```

2. **HTTP Caching:**
```javascript
// Cache-Control headers
res.set('Cache-Control', 'public, max-age=300');
```

3. **CDN Caching:**
   - Cache static frontend assets
   - Edge caching for GET requests

**Cache Invalidation:**
```javascript
// Invalidate on update/delete
async function updateCompany(id, data) {
  await CompanyModel.update(id, data);
  await client.del(`company:${id}`);  // Invalidate cache
}
```

### Performance Optimizations

**Current:**
- ✅ Database indexes on foreign keys and unique fields
- ✅ Prepared statements (query plan caching)
- ✅ Connection pooling
- ✅ Pagination for list endpoints

**Future:**
- Compression (gzip middleware)
- CDN for static assets
- Database query optimization (EXPLAIN ANALYZE)
- Background jobs for non-critical operations

---

## 🏢 Team Autonomy & Organizational Scaling

### Conway's Law

> "Organizations design systems that mirror their communication structure."

**How This Architecture Supports Team Growth:**

**Scenario:** Scale to 50 developers

```
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│  Company Team     │  │  Employee Team    │  │  Role Team        │
│  (5 developers)   │  │  (8 developers)   │  │  (3 developers)   │
│                   │  │                   │  │                   │
│  - Backend API    │  │  - Backend API    │  │  - Backend API    │
│  - React MFE      │  │  - Angular MFE    │  │  - UI Components  │
│  - Company DB     │  │  - Employee DB    │  │  - Role DB        │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

**Benefits:**
- ✅ Each team owns full stack (DB → API → UI)
- ✅ Independent release cycles
- ✅ Technology choices per team
- ✅ Clear boundaries and ownership

### Deployment Pipeline Per Service

```
Git Push → GitHub Actions → Tests → Build → Deploy to Render
                                              ↓
                                    Automatic Rollback on Failure
```

**Independent Deployment:**
- Employee team deploys without waiting for Company team
- Feature flags for gradual rollout
- Blue-green deployment per service

---

## 🧪 Testing Strategy (Future)

### Test Pyramid

```
         ▲
        / \
       / E2E\
      /       \
     /─────────\
    /Integration\
   /─────────────\
  /   Unit Tests  \
 /─────────────────\
```

**1. Unit Tests (70%)**
```javascript
describe('CompanyModel', () => {
  it('should create company with valid data', async () => {
    const company = await CompanyModel.create({
      name: 'Test Corp',
      industry: 'Technology'
    });
    expect(company).toHaveProperty('id');
  });
});
```

**2. Integration Tests (20%)**
```javascript
describe('Employee Service → Company Service Integration', () => {
  it('should reject employee with invalid company', async () => {
    await expect(
      EmployeeService.createEmployee({
        first_name: 'John',
        company_id: 'invalid-uuid'
      })
    ).rejects.toThrow('Company does not exist');
  });
});
```

**3. E2E Tests (10%)**
```javascript
describe('Employee Creation Flow', () => {
  it('should create employee through UI', async () => {
    await page.goto('/employees/create');
    await page.fill('[name="first_name"]', 'John');
    await page.selectOption('[name="company_id"]', companyId);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/employees');
  });
});
```

---

## 🚀 Deployment Architecture

### Target Infrastructure (Free Tier)

```
┌──────────────────────────────────────────────────────────────┐
│                    Vercel (Shell + Company MFE)               │
│  - Angular Shell App                                          │
│  - React Company MFE                                          │
│  - Auto HTTPS                                                 │
│  - CDN                                                        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    Netlify (Employee MFE)                     │
│  - Angular Employee MFE                                       │
│  - Auto HTTPS                                                 │
│  - CDN                                                        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    Render (Backend Services)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Company    │  │   Employee   │  │     Role     │       │
│  │   Service    │  │   Service    │  │   Service    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  - Auto HTTPS                                                 │
│  - Health Checks                                              │
│  - Auto-deploy from Git                                       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    PlanetScale (MySQL)                        │
│  - company_db                                                 │
│  - employee_db                                                │
│  - role_db                                                    │
│  - Connection pooling                                         │
│  - Auto scaling                                               │
└──────────────────────────────────────────────────────────────┘
```

### Why These Platforms?

**Render for Backend:**
- ✅ 750 hours/month free
- ✅ Auto HTTPS
- ✅ Health checks
- ✅ Environment variables
- ✅ Git-based deployment

**PlanetScale for Database:**
- ✅ 5GB storage free
- ✅ Serverless (no cold starts)
- ✅ Branching for dev/staging
- ✅ Connection pooling built-in

**Vercel/Netlify for Frontend:**
- ✅ Unlimited bandwidth
- ✅ Global CDN
- ✅ Auto HTTPS
- ✅ Preview deployments

---

## 🎯 Architecture Highlights for Interview

### Key Talking Points

1. **Microservices Benefits Demonstrated:**
   - Independent deployment
   - Technology diversity (Express for all, but could be mixed)
   - Service isolation and fault tolerance
   - Team autonomy potential

2. **Inter-Service Communication:**
   - Synchronous REST for immediate validation
   - Graceful degradation for resilience
   - Trade-offs vs async messaging

3. **Database Per Service:**
   - Data encapsulation
   - Independent scaling
   - Application-level enforcement of relationships

4. **Microfrontend Architecture:**
   - Module Federation for runtime integration
   - Framework independence (Angular + React)
   - Independent deployment

5. **Scalability Considerations:**
   - Stateless services
   - Horizontal scaling ready
   - Database optimization (indexes, pooling)

### What Would Change for Production

1. **Add API Gateway** for centralized auth, rate limiting, routing
2. **Authentication** with JWT tokens
3. **Service Mesh** (Istio) for advanced traffic management
4. **Monitoring** with Datadog, Prometheus, Grafana
5. **Event-Driven** components for async workflows
6. **CI/CD** with GitHub Actions, automated testing
7. **Infrastructure as Code** with Terraform
8. **Caching Layer** with Redis
9. **Message Queue** (RabbitMQ/Kafka) for events
10. **Container Orchestration** (Kubernetes) for production scale

---

## 📚 References & Further Reading

- [Microservices Patterns](https://microservices.io/patterns/) - Chris Richardson
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Database Per Service Pattern](https://microservices.io/patterns/data/database-per-service.html)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [The Twelve-Factor App](https://12factor.net/)

---

**Last Updated:** 2024-12-22  
**Author:** Senior Software Developer Candidate  
**Purpose:** Interview Assignment Documentation
