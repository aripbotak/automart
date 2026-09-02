import { Request } from 'express';
import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface VehicleFilterQuery extends PaginationParams {
  query?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  bodyType?: string;
  transmission?: string;
  fuelType?: string;
  condition?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'newest';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
