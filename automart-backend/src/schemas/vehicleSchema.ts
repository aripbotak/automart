import { z } from 'zod';
import {
  TransmissionType,
  FuelType,
  BodyType,
  VehicleCondition,
  Drivetrain,
  VehicleStatus,
} from '@prisma/client';

export const vehicleImageSchema = z.object({
  imageUrl: z.string().url('Invalid image URL format'),
  publicId: z.string().optional(),
  isPrimary: z.boolean().optional().default(false),
  caption: z.string().optional(),
  order: z.number().int().optional().default(0),
});

export const createVehicleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  brand: z.string().min(2, 'Brand/Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 2),
  price: z.coerce.number().positive('Price must be greater than zero'),
  originalPrice: z.coerce.number().positive().optional(),
  mileage: z.coerce.number().min(0, 'Mileage cannot be negative'),
  transmission: z.nativeEnum(TransmissionType).default(TransmissionType.AUTOMATIC),
  fuelType: z.nativeEnum(FuelType).default(FuelType.PETROL),
  bodyType: z.nativeEnum(BodyType).default(BodyType.SUV),
  condition: z.nativeEnum(VehicleCondition).default(VehicleCondition.USED),
  engine: z.string().min(1, 'Engine specification is required'),
  horsepower: z.coerce.number().int().positive('Horsepower must be a positive integer'),
  drivetrain: z.nativeEnum(Drivetrain).default(Drivetrain.AWD),
  exteriorColor: z.string().min(1, 'Exterior color is required'),
  interiorColor: z.string().min(1, 'Interior color is required'),
  vin: z.string().min(11, 'VIN must be valid (11-17 alphanumeric)').max(17),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  features: z.array(z.string()).default([]),
  featured: z.boolean().optional().default(false),
  status: z.nativeEnum(VehicleStatus).optional().default(VehicleStatus.AVAILABLE),
  images: z.array(vehicleImageSchema).optional().default([]),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const vehicleFilterSchema = z.object({
  query: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minYear: z.coerce.number().int().optional(),
  maxYear: z.coerce.number().int().optional(),
  bodyType: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  condition: z.string().optional(),
  status: z.nativeEnum(VehicleStatus).optional(),
  sortBy: z
    .enum(['price_asc', 'price_desc', 'year_desc', 'mileage_asc', 'newest'])
    .optional()
    .default('newest'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type VehicleFilterInput = z.infer<typeof vehicleFilterSchema>;
