export type TransmissionType = 'Automatic' | 'Manual' | 'Dual-Clutch' | 'CVT';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Plug-in Hybrid' | 'Electric';
export type VehicleCondition = 'Brand New' | 'Used' | 'Certified Pre-Owned';
export type BodyType = 'SUV' | 'Sedan' | 'Hatchback' | 'Coupe' | 'Truck' | 'Convertible' | 'Van' | 'Wagon';

export interface VehicleImage {
  id: string;
  url: string;
  isPrimary?: boolean;
  caption?: string;
  order?: number;
  width?: number;
  height?: number;
  blurDataUrl?: string;
}

export interface SellerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  isVerifiedDealer: boolean;
  rating: number;
  totalReviews: number;
  city: string;
  state: string;
}

export interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  bodyType: BodyType;
  condition: VehicleCondition;
  engine: string;
  horsepower: number;
  drivetrain: 'FWD' | 'RWD' | 'AWD' | '4WD';
  exteriorColor: string;
  interiorColor: string;
  vin: string;
  description: string;
  features: string[];
  images: VehicleImage[];
  featured: boolean;
  status: 'available' | 'reserved' | 'sold';
  seller: SellerInfo;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  phone?: string;
  avatar?: string;
  companyName?: string;
  createdAt: string;
}

export interface VehicleFilterState {
  query?: string;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  bodyType?: BodyType | '';
  transmission?: TransmissionType | '';
  fuelType?: FuelType | '';
  condition?: VehicleCondition | '';
  sortBy?: 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'newest';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InquiryFormData {
  vehicleId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredDate?: string;
  requestTestDrive: boolean;
  tradeInInterest: boolean;
}

export interface UploadedFileItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  cdnUrl?: string;
  errorMessage?: string;
}
