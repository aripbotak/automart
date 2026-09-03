import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';
import { ApiResponse } from '../utils/response.js';
import config from '../config/env.js';

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    ApiResponse.error(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Handle Prisma Known Request Errors
  if ('code' in err && typeof err.code === 'string') {
    if (err.code === 'P2002') {
      ApiResponse.error(res, 'A duplicate record with this value already exists.', 409);
      return;
    }
    if (err.code === 'P2025') {
      ApiResponse.error(res, 'Record to operate on was not found.', 404);
      return;
    }
  }

  // Handle Multer file upload errors
  if (err.name === 'MulterError') {
    ApiResponse.error(res, `Upload error: ${err.message}`, 400);
    return;
  }

  // Fallback for unhandled programming exceptions
  console.error('💥 Unhandled Internal Error:', err);
  const message =
    config.env === 'development'
      ? err.message || 'Internal Server Error'
      : 'An unexpected internal error occurred. Please try again later.';

  ApiResponse.error(res, message, 500);
};

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Endpoint not found on this server: ${req.method} ${req.originalUrl}`));
}
