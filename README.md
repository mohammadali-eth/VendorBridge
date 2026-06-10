# VendorBridge Enterprise Procurement Portal

<p align="center">
  <h3 align="center">Streamlining Procurement Through Automation, Transparency, and Vendor Collaboration</h3>
</p>

---

## 📖 Overview

VendorBridge is a modern Procurement & Vendor Management ERP platform designed to digitize and automate the complete procurement lifecycle of organizations.

The system enables procurement teams, vendors, managers, and administrators to collaborate through a centralized platform for managing vendors, RFQs, quotations, approvals, purchase orders, invoices, procurement analytics, and activity tracking.

VendorBridge eliminates manual procurement processes and improves operational efficiency through workflow automation and role-based access control.

---

## 🎯 Problem Statement

Traditional procurement systems often rely on:

- Emails and spreadsheets
- Manual approvals
- Unstructured vendor communication
- Poor procurement visibility
- Delayed purchasing cycles

These challenges lead to:

- Increased operational costs
- Procurement delays
- Data inconsistency
- Limited auditability
- Reduced transparency

VendorBridge addresses these issues through a centralized and automated procurement ecosystem.

---

## ✨ Core Features

### 🔐 Authentication & Authorization

- Secure Login System
- JWT Authentication
- Access & Refresh Tokens
- Protected Routes
- Session Management
- Role-Based Access Control (RBAC)

---

### 👥 Vendor Management

- Vendor Registration
- Vendor Profile Management
- Vendor Information Tracking
- Vendor Performance Monitoring
- Vendor Directory

---

### 📄 RFQ Management

- Create RFQs
- Manage Procurement Requests
- Assign Vendors
- Upload Attachments
- Set Submission Deadlines
- Track RFQ Status

---

### 💰 Quotation Management

- Vendor Quotation Submission
- Editable Quotations
- Pricing Management
- Delivery Timeline Management
- Quotation Tracking

---

### 📊 Quotation Comparison

- Side-by-Side Comparison
- Lowest Price Highlighting
- Delivery Timeline Comparison
- Vendor Rating Indicators
- Filtering & Sorting

---

### ✅ Approval Workflow

- Approve Requests
- Reject Requests
- Approval Remarks
- Approval Timeline
- Status Tracking
- Workflow Transparency

---

### 🛒 Purchase Order Management

- Auto PO Number Generation
- Purchase Order Creation
- PO Tracking
- Procurement Documentation

---

### 🧾 Invoice Management

- Invoice Generation
- Tax Calculations
- Total Calculations
- PDF Download
- Print Support
- Status Updates

---

### 🔔 Activity Logs & Notifications

- RFQ Notifications
- Approval Alerts
- Invoice Updates
- Activity Timeline
- Audit Logs

---

### 📈 Reports & Analytics

- Procurement Statistics
- Vendor Performance Analytics
- Spending Summaries
- Monthly Procurement Trends
- Exportable Reports

---

### 📊 Dashboard

- Procurement Overview
- Vendor Statistics
- Pending Approvals
- Active RFQs
- Procurement Insights
- Workflow Monitoring

---

## 👤 User Roles

### 🔴 Admin

- Manage Users
- Manage Vendors
- Manage Roles & Permissions
- Monitor Procurement Activities
- View Analytics & Reports

---

### 🔵 Procurement Officer

- Create RFQs
- Manage Procurement Requests
- Compare Quotations
- Generate Purchase Orders
- Generate Invoices

---

### 🟢 Vendor

- Submit Quotations
- Track RFQ Status
- View Purchase Orders
- Manage Vendor Information

---

### 🟡 Manager / Approver

- Review Procurement Requests
- Approve or Reject Requests
- Add Approval Remarks
- Monitor Procurement Workflow

---

## 🔄 Procurement Workflow

```text
Login
  ↓
Dashboard
  ↓
Vendor Management
  ↓
RFQ Creation
  ↓
Vendor Quotation Submission
  ↓
Quotation Comparison
  ↓
Approval Workflow
  ↓
Purchase Order Generation
  ↓
Invoice Generation
  ↓
Reports & Analytics
  ↓
Activity Logs & Notifications
```

---

## 🏗️ System Architecture

```text
Client Browser
      │
      ▼
React.js + Vite + Tailwind CSS
      │
      ▼
REST API Layer
      │
      ▼
Node.js + Express.js
      │
      ▼
Business Logic Layer
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL Database
```

---

## 🛠️ Technology Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- Context API

### Backend

- Node.js
- Express.js
- JWT Authentication
- Prisma ORM
- Bcrypt

### Database

- PostgreSQL

### Authentication

- JWT Access Tokens
- JWT Refresh Tokens
- Role-Based Access Control (RBAC)

### Development Tools

- VS Code
- Git & GitHub
- Postman
- Prisma Studio

---

## 📂 Project Structure

```text
VendorBridge
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── layouts
│   │   ├── routes
│   │   ├── services
│   │   ├── hooks
│   │   ├── context
│   │   └── utils
│   │
│   └── public
│
├── server
│   ├── src
│   │   ├── controllers
│   │   ├── routes
│   │   ├── middleware
│   │   ├── services
│   │   ├── config
│   │   ├── utils
│   │   └── validators
│   │
│   └── uploads
│
├── prisma
│   ├── schema.prisma
│   └── migrations
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the server directory:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/vendorbridge?schema=public"

PORT=5000

NODE_ENV=development

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

CLIENT_URL=http://localhost:5173
```

---

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/vendorbridge.git

cd vendorbridge
```

---

### 2. Install Dependencies

Frontend

```bash
cd client

npm install
```

Backend

```bash
cd server

npm install
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

| Email                          | Role                         | Access Level                                                                       |
| :----------------------------- | :--------------------------- | :--------------------------------------------------------------------------------- |
| `admin@vendorbridge.com`       | **Admin**                    | Manage users, register vendors, inspect system-wide audit logs and analytics.      |
| `procurement@vendorbridge.com` | **Procurement Manager**      | Approve/reject vendor selections, create and edit RFQs, generate POs and Invoices. |
| `buyer@vendorbridge.com`       | **Buyer**                    | Create RFQs, review quotations, submit vendor selections for approval.             |
| `sales@acmesupplies.com`       | **Supplier (Acme)**          | View assigned RFQs, submit/revise bids, check POs, generate invoices.              |
| `sales@techparts.com`          | **Supplier (TechParts)**     | View assigned RFQs, submit/revise bids, check POs, generate invoices.              |
| `sales@globaloffice.com`       | **Supplier (Global Office)** | View assigned RFQs, submit/revise bids, check POs, generate invoices.              |

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- PostgreSQL database

---

### 3. Setup PostgreSQL Database

Create Database

```sql
CREATE DATABASE vendorbridge;
```

---

### 4. Configure Environment Variables

Create `.env` file and update database credentials.

---

### 5. Run Prisma Migration

```bash
npx prisma migrate dev

npx prisma generate
```

---

### 6. Start Backend Server

```bash
npm run dev
```

Server runs on:

```text
http://localhost:5000
```

---

### 7. Start Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 📊 Key Modules

| Module               | Description          |
| -------------------- | -------------------- |
| Authentication       | Login, JWT, RBAC     |
| Dashboard            | Procurement Overview |
| Vendor Management    | Vendor CRUD          |
| RFQ Management       | Procurement Requests |
| Quotation Management | Vendor Quotations    |
| Comparison Engine    | Vendor Evaluation    |
| Approval Workflow    | Multi-Step Approvals |
| Purchase Orders      | PO Generation        |
| Invoice Management   | Invoice Generation   |
| Analytics            | Procurement Reports  |
| Notifications        | Activity Tracking    |

---

## 🎯 Project Objectives

- Automate procurement workflows
- Improve procurement transparency
- Centralize vendor management
- Reduce manual operations
- Accelerate approvals
- Improve reporting and analytics
- Maintain procurement audit trails

---

## 🔒 Security Features

- JWT Authentication
- Password Hashing (Bcrypt)
- Role-Based Authorization
- Protected API Routes
- Refresh Token Support
- Secure Session Management

---

## 🚀 Future Enhancements

- Email Notifications
- PDF Export Engine
- AI Vendor Recommendations
- Advanced Procurement Forecasting
- Mobile Application
- Cloud Deployment
- Multi-Organization Support
- Real-Time Notifications
- Digital Signatures
- ERP Integrations

---

## 👨‍💻 Contributors

### Mohammad Ali

Co-Founder & Full Stack Developer

### Raina Nirmal

Full Stack Developer

### Hemangi Kariya

Frontend Developer

---

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

| Command               | Action                                       |
| :-------------------- | :------------------------------------------- |
| `npm run dev`         | Runs both applications concurrently          |
| `npm run build`       | Builds both applications for production      |
| `npm run db:generate` | Generates the Prisma client                  |
| `npm run db:migrate`  | Runs database migrations                     |
| `npm run db:seed`     | Resets database and seeds transactional data |

## 📌 Conclusion

VendorBridge is a comprehensive Procurement & Vendor Management ERP platform that modernizes procurement operations through automation, transparency, analytics, and vendor collaboration.

By integrating RFQ management, quotation processing, approval workflows, purchase order generation, invoice management, and procurement analytics into a single ecosystem, VendorBridge empowers organizations to streamline purchasing operations and make data-driven procurement decisions.

---

⭐ If you find this project useful, consider giving it a star on GitHub.
