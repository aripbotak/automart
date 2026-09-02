import { z } from 'zod';

export const presignedUrlSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  contentType: z
    .string()
    .regex(/^image\/(jpeg|png|webp|avif|jpg)$/, 'Unsupported image MIME type'),
});

export type PresignedUrlInput = z.infer<typeof presignedUrlSchema>;
