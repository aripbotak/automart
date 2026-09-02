import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '@/types/index.js';
import { verifyToken } from '@/utils/jwt.js';
import { AppError } from '@/utils/AppError.js';

export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Access denied. No authentication token provided.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return next(AppError.unauthorized('Invalid or expired authentication token.'));
  }
}

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('User not authenticated.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        AppError.forbidden(`Access forbidden. Required roles: ${allowedRoles.join(', ')}`)
      );
    }

    next();
  };
}
