import { Router } from 'express';
import authRoutes from './authRoutes.js';
import vehicleRoutes from './vehicleRoutes.js';
import mediaRoutes from './mediaRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';

const router = Router();

// Health Check
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'AutoMart Backend API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Resource Routers
router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/media', mediaRoutes);
router.use('/inquiries', inquiryRoutes);

export default router;
