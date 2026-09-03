import { Router } from 'express';
import { VehicleController } from '../controllers/vehicleController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleFilterSchema,
} from '../schemas/vehicleSchema.js';
import { Role } from '@prisma/client';

const router = Router();

// Public endpoints
router.get('/', validate({ query: vehicleFilterSchema }), VehicleController.getVehicles);
router.get('/:id', VehicleController.getVehicleById);

// Protected endpoints (DEALER or ADMIN)
router.post(
  '/',
  authenticate,
  authorize(Role.DEALER, Role.ADMIN),
  validate({ body: createVehicleSchema }),
  VehicleController.createVehicle
);

router.put(
  '/:id',
  authenticate,
  authorize(Role.DEALER, Role.ADMIN),
  validate({ body: updateVehicleSchema }),
  VehicleController.updateVehicle
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.DEALER, Role.ADMIN),
  VehicleController.deleteVehicle
);

export default router;
