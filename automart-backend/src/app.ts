import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';

export function createApp(): Express {
  const app = express();

  // 1. Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // 2. CORS Configuration
  app.use(
    cors({
      origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    })
  );

  // 3. Request Logging
  if (config.env !== 'test') {
    app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
  }

  // 4. Rate Limiting (100 requests per minute per IP)
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again after a minute.',
    },
  });
  app.use(config.apiPrefix, limiter);

  // 5. Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 6. Mount API Routes
  app.use(config.apiPrefix, apiRouter);

  // 7. 404 and Global Error Middleware
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
