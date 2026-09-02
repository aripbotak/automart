# AutoMart E-Commerce Backend Service

A high-performance, modular, and fully typed RESTful Backend API for the **Web Auto Mart Platform** built with **Node.js**, **Express.js**, **PostgreSQL**, **Prisma ORM**, **TypeScript**, **JWT Authentication**, and **Cloudinary / AWS S3 Media Pipelines**.

---

## 🛠️ Tech Stack & Architecture

- **Runtime & Framework**: Node.js, Express.js (v4.21), TypeScript (ES2022 / NodeNext)
- **Database & ORM**: PostgreSQL, Prisma ORM (v5.20)
- **Security & Validation**: JWT, BcryptJS, Helmet, CORS, Rate-Limiting, Zod Request Validation
- **Media Pipeline**: Cloudinary SDK (direct WebP stream transformation) & AWS S3 SDK (Presigned URLs)
- **Logging & Diagnostics**: Morgan HTTP Logger, Custom Operational `AppError`

---

## 📂 Project Structure

```
automart-backend/
├── prisma/
│   ├── schema.prisma              # PostgreSQL schema with User, Vehicle, VehicleImage, Inquiry
│   └── seed.ts                    # Database seeder with demo accounts & vehicles
├── src/
│   ├── config/
│   │   ├── env.ts                 # Environment variable validation & loader
│   │   ├── db.ts                  # Prisma Client singleton & connection lifecycle
│   │   ├── cloudinary.ts          # Cloudinary SDK configuration
│   │   └── s3.ts                  # AWS S3 Client & presigner setup
│   ├── controllers/
│   │   ├── authController.ts      # Register, Login, Get Current Profile
│   │   ├── vehicleController.ts   # CRUD & Filter operations
│   │   ├── mediaController.ts     # Multi-image WebP upload & presigned URL generator
│   │   └── inquiryController.ts   # Booking test drives & status management
│   ├── middlewares/
│   │   ├── authMiddleware.ts      # JWT verification & Role-based Access Control
│   │   ├── errorMiddleware.ts     # Global centralized error handler & 404 handler
│   │   ├── uploadMiddleware.ts    # Multer memory storage & MIME validation
│   │   └── validateMiddleware.ts  # Zod schema validation middleware
│   ├── routes/
│   │   ├── authRoutes.ts          # /api/v1/auth
│   │   ├── vehicleRoutes.ts       # /api/v1/vehicles
│   │   ├── mediaRoutes.ts         # /api/v1/media
│   │   ├── inquiryRoutes.ts       # /api/v1/inquiries
│   │   └── index.ts               # Aggregated router & /health check
│   ├── schemas/
│   │   ├── authSchema.ts          # Zod validation schemas for auth
│   │   ├── vehicleSchema.ts       # Zod validation schemas for vehicles
│   │   ├── mediaSchema.ts         # Zod validation schemas for media
│   │   └── inquirySchema.ts       # Zod validation schemas for inquiries
│   ├── services/
│   │   ├── authService.ts         # Authentication business logic & password hashing
│   │   ├── vehicleService.ts      # Multi-facet queries, pagination & relations
│   │   ├── mediaService.ts        # Cloudinary stream uploader & S3 presigned generation
│   │   └── inquiryService.ts      # Inquiry creation & dealer assignment
│   ├── types/
│   │   └── index.ts               # AuthenticatedRequest, JwtPayload, Filter types
│   ├── utils/
│   │   ├── AppError.ts            # Custom operational error class
│   │   ├── jwt.ts                 # Sign & verify helpers
│   │   ├── password.ts            # Bcrypt hashing & verification
│   │   └── response.ts            # Standardized API response formatter
│   ├── app.ts                     # Express application configuration
│   └── server.ts                  # Server initialization & graceful shutdown
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚡ Quick Start & Setup

### 1. Install Dependencies
```bash
cd automart-backend
npm install
```

### 2. Configure Environment
Create a `.env` file based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
API_PREFIX=/api/v1
CORS_ORIGIN=http://localhost:3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/automart_db?schema=public"
JWT_SECRET="your_secure_random_jwt_secret_key"
JWT_EXPIRES_IN="7d"
STORAGE_PROVIDER="cloudinary"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Run Prisma Migrations & Seed
```bash
# Push schema to PostgreSQL database
npx prisma migrate dev --name init

# Seed demo users, vehicles, and inquiries
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```
The API is available at `http://localhost:5000/api/v1`.

---

## 📡 REST API Documentation

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new user (`BUYER` or `DEALER`) | No |
| `POST` | `/api/v1/auth/login` | Login and receive JWT access token | No |
| `GET` | `/api/v1/auth/me` | Get authenticated user profile | Yes (`Bearer Token`) |

### 🏎️ Vehicles (`/api/v1/vehicles`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/vehicles` | List vehicles with multi-facet filters & pagination | No |
| `GET` | `/api/v1/vehicles/:id` | Get vehicle details with seller info & images | No |
| `POST` | `/api/v1/vehicles` | Create a new vehicle listing | Yes (`DEALER`, `ADMIN`) |
| `PUT` | `/api/v1/vehicles/:id` | Update vehicle listing (Owner or Admin) | Yes (`DEALER`, `ADMIN`) |
| `DELETE` | `/api/v1/vehicles/:id` | Delete vehicle listing | Yes (`DEALER`, `ADMIN`) |

#### Query Parameters for `GET /api/v1/vehicles`:
- `query`: Keyword search (title, brand, model, VIN)
- `brand`: Filter by manufacturer (e.g. `Porsche`, `Tesla`, `BMW`)
- `minPrice`, `maxPrice`: Numerical price range
- `minYear`, `maxYear`: Year range (e.g. `2022` - `2025`)
- `bodyType`: `SUV`, `SEDAN`, `COUPE`, `TRUCK`, `HATCHBACK`, `CONVERTIBLE`
- `transmission`: `AUTOMATIC`, `MANUAL`, `DUAL_CLUTCH`, `CVT`
- `fuelType`: `PETROL`, `DIESEL`, `HYBRID`, `ELECTRIC`
- `condition`: `BRAND_NEW`, `CERTIFIED_PRE_OWNED`, `USED`
- `sortBy`: `newest`, `price_asc`, `price_desc`, `year_desc`, `mileage_asc`
- `page`, `limit`: Pagination controls (defaults: `page=1`, `limit=12`)

### 📸 Media Pipeline (`/api/v1/media`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/media/upload` | Upload images (auto-converted to WebP on Cloudinary) | No |
| `POST` | `/api/v1/media/presigned-url` | Generate S3 presigned PUT URL for client upload | Yes |

### 📅 Inquiries & Test Drives (`/api/v1/inquiries`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/inquiries` | Submit test-drive booking or pricing inquiry | Optional |
| `GET` | `/api/v1/inquiries` | List inquiries (filtered by role: Dealer/Buyer) | Yes |
| `PATCH` | `/api/v1/inquiries/:id/status` | Update inquiry status (`CONTACTED`, `SCHEDULED`) | Yes (`DEALER`, `ADMIN`) |
