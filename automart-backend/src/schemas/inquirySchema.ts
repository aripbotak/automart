import { z } from 'zod';
import { InquiryStatus } from '@prisma/client';

export const createInquirySchema = z.object({
  vehicleId: z.string().uuid('Invalid Vehicle ID format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address format'),
  phone: z.string().min(6, 'Valid phone number is required'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  preferredDate: z.coerce.date().optional(),
  requestTestDrive: z.boolean().optional().default(true),
  tradeInInterest: z.boolean().optional().default(false),
});

export const updateInquiryStatusSchema = z.object({
  status: z.nativeEnum(InquiryStatus),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;
