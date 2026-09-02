import { Router } from 'express';
import { MediaController } from '@/controllers/mediaController.js';
import { upload } from '@/middlewares/uploadMiddleware.js';
import { authenticate } from '@/middlewares/authMiddleware.js';
import { validate } from '@/middlewares/validateMiddleware.js';
import { presignedUrlSchema } from '@/schemas/mediaSchema.js';

const router = Router();

// Upload multiple or single image files to Cloudinary/S3
router.post('/upload', upload.array('files', 10), MediaController.upload);

// Generate S3 Presigned URL for direct client upload
router.post(
  '/presigned-url',
  authenticate,
  validate({ body: presignedUrlSchema }),
  MediaController.getPresignedUrl
);

export default router;
