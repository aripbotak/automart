import { Router } from 'express';
import { InquiryController } from '@/controllers/inquiryController.js';
import { validate } from '@/middlewares/validateMiddleware.js';
import { authenticate } from '@/middlewares/authMiddleware.js';
import {
  createInquirySchema,
  updateInquiryStatusSchema,
} from '@/schemas/inquirySchema.js';

const router = Router();

// Public: Submit a test drive booking / purchase inquiry (optional user token if logged in)
router.post(
  '/',
  (req, res, next) => {
    // Optional auth extraction without blocking guests
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      authenticate(req as any, res, () => next());
    } else {
      next();
    }
  },
  validate({ body: createInquirySchema }),
  InquiryController.createInquiry
);

// Protected: View received or submitted inquiries
router.get('/', authenticate, InquiryController.getInquiries);

// Protected: Update inquiry status (Dealer/Admin)
router.patch(
  '/:id/status',
  authenticate,
  validate({ body: updateInquiryStatusSchema }),
  InquiryController.updateStatus
);

export default router;
