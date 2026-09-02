import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100),
  role: z.enum(['BUYER', 'DEALER', 'ADMIN']).optional().default('BUYER'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
