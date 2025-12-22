# Employee MFE (Angular)

Angular microfrontend for managing employees in the Office Management System.

## Features

- ✅ List all employees with company and role names
- ✅ Create new employee with company/role dropdowns
- ✅ Edit existing employee
- ✅ Delete employee with confirmation
- ✅ Multi-service integration (Employee, Company, Role)
- ✅ Loading states and error handling
- ✅ Responsive design with Tailwind CSS

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run start
```

3. Open browser:

```
http://localhost:4201
```

## API Integration

Connects to three backend services:

- Employee Service: `http://localhost:3002/api/v1/employees`
- Company Service: `http://localhost:3001/api/v1/companies`
- Role Service: `http://localhost:3003/api/v1/roles`

## Features

- Fetches companies for dropdown
- Fetches roles for dropdown
- Validates company and role exist before creating employee
- Shows company/role names in table (not just IDs)

## Technology Stack

- Angular 17
- TypeScript
- Tailwind CSS
- RxJS

## Project Structure

```
src/
├── app/
│   ├── models/
│   │   └── employee.model.ts  # TypeScript interfaces
│   ├── services/
│   │   ├── employee.service.ts
│   │   ├── company.service.ts
│   │   └── role.service.ts
│   ├── app.component.ts       # Main component
│   └── app.config.ts
└── styles.css
```

## Testing

Make sure all 3 backend services are running:

- Company Service (port 3001)
- Employee Service (port 3002)
- Role Service (port 3003)
