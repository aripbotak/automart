import { Request, Response, NextFunction } from 'express';
import { InquiryService } from '@/services/inquiryService.js';
import { ApiResponse } from '@/utils/response.js';
import { AuthenticatedRequest } from '@/types/index.js';

export class InquiryController {
  static async createInquiry(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const inquiry = await InquiryService.createInquiry(req.body, req.user?.userId);
      ApiResponse.created(res, inquiry, 'Vehicle inquiry submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getInquiries(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const inquiries = await InquiryService.getInquiries(req.user!.userId, req.user!.role);
      ApiResponse.success(res, inquiries, 'Inquiries retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updated = await InquiryService.updateStatus(
        req.params.id,
        req.body.status,
        req.user!.userId,
        req.user!.role
      );
      ApiResponse.success(res, updated, 'Inquiry status updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default InquiryController;
