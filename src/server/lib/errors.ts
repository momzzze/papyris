export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = 'APP_ERROR',
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'BAD_REQUEST', details);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 401, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 404, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details);
    this.name = 'InternalServerError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 422, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}
