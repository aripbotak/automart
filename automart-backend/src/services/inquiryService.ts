import prisma from '../config/db.js';
import { CreateInquiryInput } from '../schemas/inquirySchema.js';
import { AppError } from '../utils/AppError.js';
import { InquiryStatus, Role } from '@prisma/client';

export class InquiryService {
  static async createInquiry(input: CreateInquiryInput, userId?: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: input.vehicleId },
      select: { id: true, title: true, sellerId: true },
    });

    if (!vehicle) {
      throw AppError.notFound(`Vehicle with ID ${input.vehicleId} does not exist.`);
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        vehicleId: input.vehicleId,
        userId: userId || null,
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone,
        message: input.message,
        preferredDate: input.preferredDate,
        requestTestDrive: input.requestTestDrive ?? true,
        tradeInInterest: input.tradeInInterest ?? false,
        status: InquiryStatus.PENDING,
      },
      include: {
        vehicle: {
          select: {
            id: true,
            title: true,
            brand: true,
            model: true,
            price: true,
          },
        },
      },
    });

    return inquiry;
  }

  static async getInquiries(userId: string, userRole: Role) {
    // If dealer, fetch inquiries for all vehicles owned by this dealer
    if (userRole === Role.DEALER) {
      return prisma.inquiry.findMany({
        where: {
          vehicle: {
            sellerId: userId,
          },
        },
        include: {
          vehicle: {
            select: {
              id: true,
              title: true,
              brand: true,
              model: true,
              price: true,
              images: { take: 1 },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // If admin, fetch all inquiries
    if (userRole === Role.ADMIN) {
      return prisma.inquiry.findMany({
        include: {
          vehicle: {
            select: {
              id: true,
              title: true,
              seller: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Buyer: fetch their submitted inquiries
    return prisma.inquiry.findMany({
      where: { userId },
      include: {
        vehicle: {
          select: {
            id: true,
            title: true,
            brand: true,
            model: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateStatus(
    inquiryId: string,
    status: InquiryStatus,
    userId: string,
    userRole: Role
  ) {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
      include: {
        vehicle: { select: { sellerId: true } },
      },
    });

    if (!inquiry) {
      throw AppError.notFound(`Inquiry with ID ${inquiryId} not found.`);
    }

    if (inquiry.vehicle.sellerId !== userId && userRole !== Role.ADMIN) {
      throw AppError.forbidden('You do not have permission to update this inquiry status.');
    }

    return prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status },
    });
  }
}

export default InquiryService;
