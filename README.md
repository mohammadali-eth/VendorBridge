# VendorBridge Enterprise Procurement Portal

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
- **`frontend`**: React 19 single-page application built using Vite, CSS Variables, Axios, Zustand, and React Router DOM.
- **`backend`**: Express.js REST API server utilizing Helmet, CORS, Morgan, express-rate-limit, Cookie Parser, Compression, JWT Auth, and PostgreSQL with Prisma ORM.

### 2. Internal Packages (`packages/`)
- **`@vendorbridge/constants`**: Shared enums for system roles, RFQ status flow, quotation status, and PO transitions.
- **`@vendorbridge/types`**: JSDoc model declarations providing autocomplete across packages.
- **`@vendorbridge/validators`**: Reusable validation schemas mapping corporate entity validators.
- **`@vendorbridge/shared`**: Shared formatting utilities (currency, dates), type helpers, and centralized operational error handling base class (`AppError`).

---

## Features & Dynamic Modules

All modules have been converted from static mocks to a fully dynamic database-driven engine:
- **Interactive KPI Cards & Charts**: Displays real-time counts, spend, and charts compiled via SQL aggregations.
- **Dynamic RFQ & Bidding Pipeline**: Buyers publish RFQs, which are instantly visible to assigned suppliers.
- **Quotation Comparison Matrix**: Real-time evaluation grid comparing supplier price, timeline, tax, and terms.
- **Multi-Level Approval Flow**: Tracks vendor selection approvals through hierarchical steps (Procurement Manager).
- **Automated PO & Invoices**: Generate Purchase Orders upon selection approval; suppliers submit corresponding Invoices with calculated subtotal, GST, and grand total.

---

## Seed Accounts (For Local Testing)

Use the following credentials to test different system-wide role permissions. The default password for all seed accounts is `password123`.

| Email | Role | Access Level |
| :--- | :--- | :--- |
| `admin@vendorbridge.com` | **Admin** | Manage users, register vendors, inspect system-wide audit logs and analytics. |
| `procurement@vendorbridge.com` | **Procurement Manager** | Approve/reject vendor selections, create and edit RFQs, generate POs and Invoices. |
| `buyer@vendorbridge.com` | **Buyer** | Create RFQs, review quotations, submit vendor selections for approval. |
| `sales@acmesupplies.com` | **Supplier (Acme)** | View assigned RFQs, submit/revise bids, check POs, generate invoices. |
| `sales@techparts.com` | **Supplier (TechParts)** | View assigned RFQs, submit/revise bids, check POs, generate invoices. |
| `sales@globaloffice.com` | **Supplier (Global Office)** | View assigned RFQs, submit/revise bids, check POs, generate invoices. |

---

## Getting Started

### Prerequisites
- Node.js >= 18.x
- PostgreSQL database

### Setup & Installation

1. **Clone and Install Dependencies**
   Install all package structures and link local workspaces:
   ```bash
   npm install
   ```

2. **Initialize Database**
   Configure your `.env` file in `apps/backend/.env` with your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/vendorbridge?schema=public"
   JWT_SECRET="your_jwt_secret"
   ```

   Apply migrations and database seeds:
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Apply migrations
   npm run db:migrate

   # Seed database with historical transactional records
   npm run db:seed
   ```

3. **Run Dev Environment**
   Launch both React frontend and Express backend concurrently:
   ```bash
   npm run dev
   ```

---

## Useful Workspace Scripts

The following commands are available from the root directory:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs both applications concurrently |
| `npm run build` | Builds both applications for production |
| `npm run db:generate` | Generates the Prisma client |
| `npm run db:migrate` | Runs database migrations |
| `npm run db:seed` | Resets database and seeds transactional data |
