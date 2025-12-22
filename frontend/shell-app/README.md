# Shell App

This is the Angular Shell (host) application for the Office Management System.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm start
```

3. Open browser:

```
http://localhost:4200
```

## Features

- **Dashboard**: Overview with stats
- **Companies**: React microfrontend (Module Federation)
- **Employees**: Angular microfrontend (Module Federation)

## Structure

```
src/
├── app/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── companies/
│   │   └── employees/
│   ├── shared/
│   │   └── components/
│   │       └── header/
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── styles.css
└── index.html
```

## Next Steps

1. Run `npm install` to install dependencies
2. Configure Module Federation for loading microfrontends
3. Build Company MFE (React)
4. Build Employee MFE (Angular)
