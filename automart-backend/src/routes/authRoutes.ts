import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

const router = Router();

router.post('/register', validate({ body: registerSchema }), AuthController.register);
router.post('/login', validate({ body: loginSchema }), AuthController.login);
router.get('/me', authenticate, AuthController.getProfile);

export default router;
