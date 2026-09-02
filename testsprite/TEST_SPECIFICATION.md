# TestSprite Quality Assurance & Automation Specification

## 🎯 Target System Under Test (SUT)
- **Frontend Application**: `http://localhost:3000` (Next.js 14 App Router)
- **Backend REST API**: `http://localhost:5000/api/v1` (Express + PostgreSQL + Prisma)

---

## 📋 Comprehensive Test Matrix & Assertion Checkpoints

### 1. Authentication & Role-Based Access Flow (RBAC)

| Test ID | Test Name | Scope | Execution Steps | Key Assertion Checkpoints |
| :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-001** | User Registration & JWT Issuance | Backend | `POST /api/v1/auth/register` with `{ name, email, password, role: 'BUYER' }` | 1. Status is `201 Created`<br>2. Response includes valid signed `token`<br>3. Password hash is omitted from response payload |
| **TC-AUTH-002** | User Login & Token Verification | Backend | `POST /api/v1/auth/login` with email & password | 1. Status is `200 OK`<br>2. Bearer JWT token returned<br>3. User profile object populated |
| **TC-AUTH-003** | Protected Profile Endpoint | Backend | `GET /api/v1/auth/me` with `Authorization: Bearer <token>` | 1. Status is `200 OK`<br>2. Decoded JWT matches requested user account |
| **TC-AUTH-004** | RBAC Dealer Route Security | Backend | `POST /api/v1/vehicles` with `BUYER` token | 1. Status is `403 Forbidden`<br>2. Prevents unauthorized listing creation |
| **TC-AUTH-005** | LocalStorage Token Retention | Frontend | Fill login form at `http://localhost:3000/login` | 1. Form redirects to `/vehicles`<br>2. `localStorage.getItem('automart_auth_token')` is set |

---

### 2. Vehicle Inventory & Multi-Facet Filter Flow

| Test ID | Test Name | Scope | Execution Steps | Key Assertion Checkpoints |
| :--- | :--- | :--- | :--- | :--- |
| **TC-VEH-001** | Brand / Manufacturer Filtering | Backend | `GET /api/v1/vehicles?brand=Porsche` | 1. Status is `200 OK`<br>2. 100% of returned items match `brand == 'Porsche'` |
| **TC-VEH-002** | Price Range Filtering | Backend | `GET /api/v1/vehicles?minPrice=80000&maxPrice=100000` | 1. Every vehicle price satisfies: `$80,000 <= price <= $100,000` |
| **TC-VEH-003** | Dynamic Price Sorting | Backend | `GET /api/v1/vehicles?sortBy=price_desc` | 1. Items ordered in descending price sequence ($P_i \ge P_{i+1}$) |
| **TC-VEH-004** | Pagination Metadata | Backend | `GET /api/v1/vehicles?page=1&limit=2` | 1. Response includes `meta: { total, page: 1, limit: 2, totalPages }` |
| **TC-VEH-005** | Single Vehicle Detail Query | Backend | `GET /api/v1/vehicles/:id` | 1. Returns full specs (VIN, HP, Drivetrain)<br>2. Nested `seller` contact info<br>3. Ordered `images` array |
| **TC-VEH-006** | Reactive Filter Sidebar UI | Frontend | Click SUV body style on `/vehicles` | 1. URL updates query string `?bodyType=SUV`<br>2. Vehicle grid re-renders filtered items |

---

### 3. Media Pipeline & Test-Drive Inquiry Flow

| Test ID | Test Name | Scope | Execution Steps | Key Assertion Checkpoints |
| :--- | :--- | :--- | :--- | :--- |
| **TC-MEDIA-001** | Cloudinary WebP Transformation | Frontend | `buildCdnUrl(url, 1200, 85, 'cloudinary')` | 1. Inserts `f_auto,q_85,w_1200,c_limit` in URL path |
| **TC-MEDIA-002** | S3 & Imgix Compression Pipeline | Frontend | `buildCdnUrl(s3Url, 800, 80, 's3')` | 1. Query string contains `auto=format,compress&q=80&w=800` |
| **TC-MEDIA-003** | Shimmer Blur Placeholder | Frontend | Inspect `<OptimizedImage />` DOM | 1. Contains inline SVG data URI shimmer base64 placeholder |
| **TC-INQ-001** | Test-Drive Inquiry Submission | Backend | `POST /api/v1/inquiries` with vehicleId and date | 1. Status is `201 Created`<br>2. Initial status is `PENDING`<br>3. Linked to target Vehicle |
| **TC-INQ-002** | Zod Schema Error Guard | Backend | `POST /api/v1/inquiries` with invalid email | 1. Status is `422 Unprocessable Entity`<br>2. Detailed field error message returned |
| **TC-INQ-003** | Inquiry Modal Success State | Frontend | Submit form in `<InquiryModal />` | 1. Modal displays confirmation checkmark<br>2. Success banner shown to user |

---

## 🚀 Running the Automated TestSuite

### Prerequisite
Ensure both services are running in separate terminal sessions:

```bash
# Terminal 1 - Backend Server
cd c:\project\automart\automart-backend
npm run dev

# Terminal 2 - Frontend Application
cd c:\project\automart
npm run dev
```

### Execute TestSprite Runner
In a new terminal window:
```bash
cd c:\project\automart
npx tsx testsprite/runner.ts
```
The test runner will run all suites, output assertion results in the terminal, and save the full JSON test report to `testsprite/reports/test_report.json`.
