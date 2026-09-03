import { Request, Response, NextFunction } from 'express';
import { MediaService } from '../services/mediaService.js';
import { ApiResponse } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';

export class MediaController {
  static async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const singleFile = req.file;

      const fileList = files && files.length > 0 ? files : singleFile ? [singleFile] : [];

      if (fileList.length === 0) {
        throw AppError.badRequest('No image files provided in the request form-data.');
      }

      const results = await MediaService.uploadMedia(fileList);

      // Return object if single file, array if multiple
      const responseData = results.length === 1 ? results[0] : results;
      ApiResponse.created(res, responseData, 'Media uploaded and processed to WebP successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getPresignedUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { filename, contentType } = req.body;
      const result = await MediaService.generateS3PresignedUrl(filename, contentType);
      ApiResponse.success(res, result, 'S3 Presigned upload URL generated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default MediaController;
