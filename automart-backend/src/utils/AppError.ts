export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode = 500,
    errors?: Record<string, string[]>,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', errors?: Record<string, string[]>): AppError {
    return new AppError(message, 400, errors);
  }

  static unauthorized(message = 'Unauthorized access'): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Forbidden: You do not have permission'): AppError {
    return new AppError(message, 403);
  }

  static notFound(message = 'Resource not found'): AppError {
    return new AppError(message, 404);
  }

  static conflict(message = 'Resource already exists'): AppError {
    return new AppError(message, 409);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(message, 500, undefined, false);
  }
}

export default AppError;
