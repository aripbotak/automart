import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { ApiResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../types/index.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      ApiResponse.created(res, result, 'User account registered successfully');
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      ApiResponse.success(res, result, 'Logged in successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await AuthService.getCurrentUserProfile(req.user!.userId);
      ApiResponse.success(res, profile, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
