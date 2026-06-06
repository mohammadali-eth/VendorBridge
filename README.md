# VendorBridge Enterprise Monorepo

VendorBridge is an enterprise-grade Supplier & Request for Quotation (RFQ) Portal built as a high-performance, modular monorepo using npm workspaces.

---

## Workspace Architecture

```mermaid
graph TD
  Root[npm Workspaces Root]
  Root --> Apps[apps/]
  Root --> Packages[packages/]

  Apps --> Frontend[frontend]
  Apps --> Backend[backend]

  Packages --> Const[@vendorbridge/constants]
  Packages --> Types[@vendorbridge/types]
  Packages --> Val[@vendorbridge/validators]
  Packages --> Shared[@vendorbridge/shared]

  Frontend -.-> Const
  Frontend -.-> Types
  Frontend -.-> Val
  Frontend -.-> Shared

  Backend -.-> Const
  Backend -.-> Types
  Backend -.-> Val
  Backend -.-> Shared
```

### 1. Applications (`apps/`)
- **`frontend`**: React 19 single-page application built using Vite, Tailwind CSS, Axios, React Hook Form, and React Router DOM.
- **`backend`**: Express.js REST API server utilizing Helmet, CORS, Morgan, express-rate-limit, Cookie Parser, Compression, JWT Auth, and PostgreSQL with Prisma ORM.

### 2. Internal Packages (`packages/`)
- **`@vendorbridge/constants`**: Enums for system roles, RFQ status flow, quotation status, and PO transitions.
- **`@vendorbridge/types`**: JSDoc model declarations providing autocomplete across packages.
- **`@vendorbridge/validators`**: Reusable Zod schemas mapping corporate entity validators.
- **`@vendorbridge/shared`**: Shared formatting utilities (currency, dates), type helpers, and centralized operational error handling base class (`AppError`).

---

## Getting Started

### Prerequisites
- Node.js >= 18.x
- PostgreSQL database (or Docker installed)

### Setup & Installation

1. **Clone and Install Dependencies**
   Install all package structures and link local workspaces:
   ```bash
   npm install
   ```

2. **Initialize Database**
   Start PostgreSQL container:
   ```bash
   docker-compose up -d
   ```

   Apply migrations and database seeds:
   ```bash
   npm run prisma:generate --workspace=@vendorbridge/backend
   npm run prisma:migrate --workspace=@vendorbridge/backend
   npm run prisma:seed --workspace=@vendorbridge/backend
   ```

3. **Run Dev Environment**
   Launch React and Express servers concurrently:
   ```bash
   npm run dev
   ```

---

## Production Configurations
- **Database**: Primary keys use UUIDv4 generated at runtime to protect resource enumerations.
- **Path Aliases**: Frontend uses `@/` alias mapped via Vite. Backend uses native Node subpath imports `#` configured inside `package.json`.
- **Security**: Includes strict rate-limiting, CORS whitelisting, HTTP headers protection, payload limits, and bcrypt hashing for credentials.
