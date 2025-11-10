/**
 * @summary
 * Global error handling middleware.
 * Catches and formats all application errors.
 *
 * @module middleware/error
 */

import { Request, Response, NextFunction } from 'express';

/**
 * @interface ErrorResponse
 * @description Standard error response structure
 *
 * @property {boolean} success - Always false for errors
 * @property {object} error - Error details
 * @property {string} error.code - Error code
 * @property {string} error.message - Error message
 * @property {any} [error.details] - Additional error details
 * @property {string} timestamp - Error timestamp
 */
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * @function errorMiddleware
 * @description Global error handler middleware
 *
 * @param {Error} error - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next function
 */
export function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction): void {
  const statusCode = error.statusCode || 500;
  const errorCode = error.code || 'INTERNAL_SERVER_ERROR';
  const message = error.message || 'An unexpected error occurred';

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message: message,
      ...(process.env.NODE_ENV === 'development' && { details: error.stack }),
    },
    timestamp: new Date().toISOString(),
  };

  console.error('Error:', {
    code: errorCode,
    message: message,
    path: req.path,
    method: req.method,
    stack: error.stack,
  });

  res.status(statusCode).json(errorResponse);
}

/**
 * @constant StatusGeneralError
 * @description Standard general error object
 */
export const StatusGeneralError = {
  statusCode: 500,
  code: 'GENERAL_ERROR',
  message: 'An error occurred while processing your request',
};
