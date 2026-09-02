import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '@/services/vehicleService.js';
import { ApiResponse } from '@/utils/response.js';
import { AuthenticatedRequest } from '@/types/index.js';

export class VehicleController {
  static async getVehicles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await VehicleService.getVehicles(req.query as any);
      ApiResponse.success(res, result.data, 'Vehicles retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getVehicleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await VehicleService.getVehicleById(req.params.id);
      ApiResponse.success(res, vehicle, 'Vehicle details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createVehicle(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const created = await VehicleService.createVehicle(req.body, req.user!.userId);
      ApiResponse.created(res, created, 'Vehicle listed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateVehicle(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updated = await VehicleService.updateVehicle(
        req.params.id,
        req.body,
        req.user!.userId,
        req.user!.role
      );
      ApiResponse.success(res, updated, 'Vehicle listing updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteVehicle(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await VehicleService.deleteVehicle(req.params.id, req.user!.userId, req.user!.role);
      ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export default VehicleController;
