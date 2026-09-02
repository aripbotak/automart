import { Response } from 'express';

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: unknown;
  errors?: Record<string, string[]>;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data?: T,
    message = 'Request successful',
    statusCode = 200,
    meta?: unknown
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(meta !== undefined && { meta }),
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Resource created successfully'
  ): Response {
    return ApiResponse.success(res, data, message, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static error(
    res: Response,
    message = 'An error occurred',
    statusCode = 500,
    errors?: Record<string, string[]>
  ): Response {
    const payload: ApiResponsePayload = {
      success: false,
      message,
      ...(errors && { errors }),
    };
    return res.status(statusCode).json(payload);
  }
}

export default ApiResponse;
