import prisma from '@/config/db.js';
import { CreateVehicleInput, UpdateVehicleInput, VehicleFilterInput } from '@/schemas/vehicleSchema.js';
import { AppError } from '@/utils/AppError.js';
import { PaginatedResult } from '@/types/index.js';
import {
  Prisma,
  Vehicle,
  TransmissionType,
  FuelType,
  BodyType,
  VehicleCondition,
  Role,
} from '@prisma/client';

export class VehicleService {
  static async getVehicles(filter: VehicleFilterInput): Promise<PaginatedResult<Vehicle>> {
    const {
      query,
      brand,
      model,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      bodyType,
      transmission,
      fuelType,
      condition,
      status,
      sortBy = 'newest',
      page = 1,
      limit = 12,
    } = filter;

    const where: Prisma.VehicleWhereInput = {};

    // 1. Keyword search across title, brand, model
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { model: { contains: query, mode: 'insensitive' } },
        { vin: { contains: query, mode: 'insensitive' } },
      ];
    }

    // 2. Specific filters
    if (brand) {
      where.brand = { equals: brand, mode: 'insensitive' };
    }

    if (model) {
      where.model = { contains: model, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = new Prisma.Decimal(minPrice);
      if (maxPrice !== undefined) where.price.lte = new Prisma.Decimal(maxPrice);
    }

    if (minYear !== undefined || maxYear !== undefined) {
      where.year = {};
      if (minYear !== undefined) where.year.gte = minYear;
      if (maxYear !== undefined) where.year.lte = maxYear;
    }

    if (bodyType && Object.values(BodyType).includes(bodyType.toUpperCase() as BodyType)) {
      where.bodyType = bodyType.toUpperCase() as BodyType;
    }

    if (
      transmission &&
      Object.values(TransmissionType).includes(
        transmission.toUpperCase().replace('-', '_') as TransmissionType
      )
    ) {
      where.transmission = transmission.toUpperCase().replace('-', '_') as TransmissionType;
    }

    if (
      fuelType &&
      Object.values(FuelType).includes(
        fuelType.toUpperCase().replace('-', '_') as FuelType
      )
    ) {
      where.fuelType = fuelType.toUpperCase().replace('-', '_') as FuelType;
    }

    if (
      condition &&
      Object.values(VehicleCondition).includes(
        condition.toUpperCase().replace(/[\s-]/g, '_') as VehicleCondition
      )
    ) {
      where.condition = condition.toUpperCase().replace(/[\s-]/g, '_') as VehicleCondition;
    }

    if (status) {
      where.status = status;
    }

    // 3. Dynamic Ordering
    let orderBy: Prisma.VehicleOrderByWithRelationInput = { createdAt: 'desc' };

    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'year_desc':
        orderBy = { year: 'desc' };
        break;
      case 'mileage_asc':
        orderBy = { mileage: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // 4. Execution
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      prisma.vehicle.count({ where }),
      prisma.vehicle.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
          },
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true,
              companyName: true,
              isVerifiedDealer: true,
              city: true,
              state: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async getVehicleById(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            companyName: true,
            isVerifiedDealer: true,
            city: true,
            state: true,
          },
        },
      },
    });

    if (!vehicle) {
      throw AppError.notFound(`Vehicle with ID ${id} not found.`);
    }

    return vehicle;
  }

  static async createVehicle(input: CreateVehicleInput, sellerId: string) {
    const existingVin = await prisma.vehicle.findUnique({
      where: { vin: input.vin.toUpperCase() },
    });

    if (existingVin) {
      throw AppError.conflict(`A vehicle with VIN ${input.vin} is already listed.`);
    }

    const { images, ...vehicleData } = input;

    const created = await prisma.vehicle.create({
      data: {
        ...vehicleData,
        vin: input.vin.toUpperCase(),
        sellerId,
        images: {
          create: images.map((img, index) => ({
            imageUrl: img.imageUrl,
            publicId: img.publicId,
            isPrimary: img.isPrimary ?? index === 0,
            caption: img.caption,
            order: img.order ?? index,
          })),
        },
      },
      include: {
        images: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
          },
        },
      },
    });

    return created;
  }

  static async updateVehicle(
    id: string,
    input: UpdateVehicleInput,
    userId: string,
    userRole: Role
  ) {
    const existing = await prisma.vehicle.findUnique({
      where: { id },
      select: { sellerId: true },
    });

    if (!existing) {
      throw AppError.notFound(`Vehicle with ID ${id} not found.`);
    }

    // Permission check: only vehicle owner or ADMIN
    if (existing.sellerId !== userId && userRole !== Role.ADMIN) {
      throw AppError.forbidden('You do not have permission to modify this vehicle listing.');
    }

    const { images, ...vehicleData } = input;

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        ...vehicleData,
        ...(input.vin && { vin: input.vin.toUpperCase() }),
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((img, index) => ({
              imageUrl: img.imageUrl,
              publicId: img.publicId,
              isPrimary: img.isPrimary ?? index === 0,
              caption: img.caption,
              order: img.order ?? index,
            })),
          },
        }),
      },
      include: {
        images: true,
      },
    });

    return updated;
  }

  static async deleteVehicle(id: string, userId: string, userRole: Role) {
    const existing = await prisma.vehicle.findUnique({
      where: { id },
      select: { sellerId: true },
    });

    if (!existing) {
      throw AppError.notFound(`Vehicle with ID ${id} not found.`);
    }

    if (existing.sellerId !== userId && userRole !== Role.ADMIN) {
      throw AppError.forbidden('You do not have permission to delete this listing.');
    }

    await prisma.vehicle.delete({
      where: { id },
    });

    return { id };
  }
}

export default VehicleService;
