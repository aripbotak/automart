import { cloudinary } from '@/config/cloudinary.js';
import { s3Client } from '@/config/s3.js';
import config from '@/config/env.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppError } from '@/utils/AppError.js';
import crypto from 'crypto';

export interface UploadResult {
  url: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  provider: 'cloudinary' | 's3';
}

export class MediaService {
  /**
   * Uploads an in-memory image buffer directly to Cloudinary with WebP and auto-optimizations
   */
  static async uploadToCloudinary(
    fileBuffer: Buffer,
    originalName: string
  ): Promise<UploadResult> {
    if (!config.cloudinary.cloudName || !config.cloudinary.apiKey) {
      throw AppError.internal(
        'Cloudinary credentials are not configured in environment variables.'
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: config.cloudinary.folder,
          format: 'webp', // Standardize to WebP format
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
            { width: 1920, crop: 'limit' },
          ],
          public_id: `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
        },
        (error, result) => {
          if (error || !result) {
            reject(new AppError(`Cloudinary upload failed: ${error?.message || 'Unknown error'}`));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              provider: 'cloudinary',
            });
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Generate an AWS S3 Presigned PUT URL for client-side direct upload
   */
  static async generateS3PresignedUrl(
    filename: string,
    contentType: string
  ): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
    if (!config.aws.bucketName) {
      throw AppError.internal('AWS S3 bucket name is not configured.');
    }

    const fileExtension = filename.split('.').pop() || 'webp';
    const key = `vehicles/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: config.aws.bucketName,
      Key: key,
      ContentType: contentType,
      CacheControl: 'max-age=31536000',
    });

    try {
      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      const fileUrl = `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;

      return {
        uploadUrl,
        fileUrl,
        key,
      };
    } catch (error) {
      throw AppError.internal(`Failed to generate S3 presigned URL: ${(error as Error).message}`);
    }
  }

  /**
   * Upload single or multiple files based on configured storage provider
   */
  static async uploadMedia(files: Express.Multer.File[]): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      throw AppError.badRequest('No image files provided for upload.');
    }

    const uploadPromises = files.map((file) =>
      this.uploadToCloudinary(file.buffer, file.originalname)
    );

    return Promise.all(uploadPromises);
  }
}

export default MediaService;
