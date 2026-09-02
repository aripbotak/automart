# AutoMart Modern Frontend Boilerplate & E-Commerce Platform

A production-grade, highly performant frontend architecture for **Web Auto Mart E-Commerce** engineered with Next.js 14 (App Router), TypeScript, Tailwind CSS, TanStack Query, Zustand, React Hook Form, and Lucide React.

---

## 🚀 Key Architectural Features

1. **Next.js 14 App Router Architecture**:
   - Organized into route groups: `(main)`, `(auth)`, and `(dashboard)`.
   - Server-Side Rendering (SSR) & Client Component isolation where interactive state is required.
   
2. **Dynamic Media Pipeline (`components/ui/OptimizedImage.tsx`)**:
   - Automatic dynamic transformations for **Cloudinary**, **AWS CloudFront/S3**, and **Imgix**.
   - Auto WebP / AVIF format selection, lazy loading, base64 blur/shimmer placeholder generation, and fallback image recovery.

3. **High-Performance State & Data Fetching**:
   - **TanStack Query (React Query v5)** for asynchronous vehicle data fetching, caching (`staleTime: 5 mins`), optimistic mutations, and pagination.
   - **Zustand** for client-side search filters, bookmarking/favorites, and multi-vehicle comparison matrices with `localStorage` persistence.

4. **Modern UI/UX Components & Styling**:
   - Atomic Design: Reusable UI components (`Button`, `Input`, `Badge`, `Card`, `Modal`, `OptimizedImage`).
   - Domain-specific widgets: `SearchBar`, `ImageGallery` (with fullscreen lightbox), `VehicleCard`, `VehicleFilter`, `InquiryModal`, and `DynamicImageUploader`.

5. **Type Safety & Validation**:
   - Fully typed domain models (`Vehicle`, `User`, `SellerInfo`, `VehicleImage`, `InquiryFormData`).
   - React Hook Form with validation schemas.

---

## 📂 Project Structure

```
automart/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── seller/
│   │       └── page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Homepage (Hero, quick search, featured showcase, category browser)
│   │   └── vehicles/
│   │       ├── page.tsx           # Vehicle catalog with sidebar filters & grid
│   │       └── [id]/
│   │           └── page.tsx       # Detail view with specs, image gallery & inquiry modal
│   ├── globals.css
│   ├── layout.tsx                 # Root layout with font and Providers
│   └── providers.tsx              # TanStack Query Client Provider
├── components/
│   ├── features/
│   │   ├── DynamicImageUploader.tsx
│   │   ├── InquiryModal.tsx
│   │   ├── VehicleCard.tsx
│   │   └── VehicleFilter.tsx
│   ├── shared/
│   │   ├── Footer.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── Navbar.tsx
│   │   └── SearchBar.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── OptimizedImage.tsx     # Dynamic Cloudinary/S3 WebP Pipeline Wrapper
├── hooks/
│   ├── useDynamicMediaUpload.ts
│   ├── useVehicles.ts             # TanStack Query hooks
│   └── useVehicleStore.ts         # Zustand state store
├── lib/
│   ├── api-client.ts              # Axios instance with interceptors & typed helpers
│   ├── constants.ts               # Brand lists, mock vehicles, filter metadata
│   └── utils.ts                   # Tailwind cn(), currency and mileage formatters
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.automart.example.com/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CDN_DOMAIN=https://images.automart.com
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
