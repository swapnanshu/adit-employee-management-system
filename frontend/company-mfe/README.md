# Company MFE (React + Vite)

React microfrontend for managing companies in the Office Management System.

## Features

- ✅ List all companies with table view
- ✅ Create new company with validation
- ✅ Edit existing company
- ✅ Delete company with confirmation
- ✅ Loading states and error handling
- ✅ Responsive design with Tailwind CSS

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open browser:

```
http://localhost:4202
```

## API Integration

Connects to Company Service backend:

- Base URL: `http://localhost:3001/api/v1`
- Endpoints: GET, POST, PATCH, DELETE `/companies`

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios

## Project Structure

```
src/
├── components/
│   ├── CompanyList.tsx    # Table with CRUD actions
│   └── CompanyForm.tsx    # Create/Edit modal form
├── services/
│   └── companyService.ts  # API integration
├── types/
│   └── company.types.ts   # TypeScript interfaces
├── App.tsx                # Main component
└── main.tsx               # Entry point
```

## Testing

Make sure the Company Service backend is running on port 3001 before starting this app.
