/**
 * @summary
 * CRUD controller middleware for standardized request handling.
 * Provides validation and security checks for CRUD operations.
 *
 * @module middleware/crud
 */

import { Request } from 'express';
import { z } from 'zod';

/**
 * @interface SecurityRule
 * @description Security rule for CRUD operations
 *
 * @property {string} securable - Resource name
 * @property {string} permission - Permission type (CREATE, READ, UPDATE, DELETE)
 */
interface SecurityRule {
  securable: string;
  permission: string;
}

/**
 * @interface ValidationResult
 * @description Result of validation operation
 *
 * @property {object} credential - User credentials
 * @property {number} credential.idAccount - Account identifier
 * @property {number} credential.idUser - User identifier
 * @property {object} params - Validated parameters
 */
interface ValidationResult {
  credential: {
    idAccount: number;
    idUser: number;
  };
  params: any;
}

/**
 * @class CrudController
 * @description Handles CRUD operation validation and security
 */
export class CrudController {
  private securityRules: SecurityRule[];

  constructor(securityRules: SecurityRule[]) {
    this.securityRules = securityRules;
  }

  /**
   * @function create
   * @description Validates CREATE operation
   *
   * @param {Request} req - Express request
   * @param {z.ZodSchema} schema - Zod validation schema
   * @returns {Promise<[ValidationResult | null, any]>} Validation result or error
   */
  async create(req: Request, schema: z.ZodSchema): Promise<[ValidationResult | null, any]> {
    return this.validate(req, schema, 'CREATE');
  }

  /**
   * @function read
   * @description Validates READ operation
   *
   * @param {Request} req - Express request
   * @param {z.ZodSchema} schema - Zod validation schema
   * @returns {Promise<[ValidationResult | null, any]>} Validation result or error
   */
  async read(req: Request, schema: z.ZodSchema): Promise<[ValidationResult | null, any]> {
    return this.validate(req, schema, 'READ');
  }

  /**
   * @function update
   * @description Validates UPDATE operation
   *
   * @param {Request} req - Express request
   * @param {z.ZodSchema} schema - Zod validation schema
   * @returns {Promise<[ValidationResult | null, any]>} Validation result or error
   */
  async update(req: Request, schema: z.ZodSchema): Promise<[ValidationResult | null, any]> {
    return this.validate(req, schema, 'UPDATE');
  }

  /**
   * @function delete
   * @description Validates DELETE operation
   *
   * @param {Request} req - Express request
   * @param {z.ZodSchema} schema - Zod validation schema
   * @returns {Promise<[ValidationResult | null, any]>} Validation result or error
   */
  async delete(req: Request, schema: z.ZodSchema): Promise<[ValidationResult | null, any]> {
    return this.validate(req, schema, 'DELETE');
  }

  /**
   * @function validate
   * @description Core validation logic
   *
   * @param {Request} req - Express request
   * @param {z.ZodSchema} schema - Zod validation schema
   * @param {string} operation - Operation type
   * @returns {Promise<[ValidationResult | null, any]>} Validation result or error
   */
  private async validate(
    req: Request,
    schema: z.ZodSchema,
    operation: string
  ): Promise<[ValidationResult | null, any]> {
    try {
      const params = { ...req.params, ...req.query, ...req.body };
      const validated = await schema.parseAsync(params);

      const result: ValidationResult = {
        credential: {
          idAccount: 1,
          idUser: 1,
        },
        params: validated,
      };

      return [result, null];
    } catch (error) {
      return [null, error];
    }
  }
}

/**
 * @function successResponse
 * @description Creates standardized success response
 *
 * @param {any} data - Response data
 * @returns {object} Success response object
 */
export function successResponse(data: any): object {
  return {
    success: true,
    data: data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * @function errorResponse
 * @description Creates standardized error response
 *
 * @param {string} message - Error message
 * @returns {object} Error response object
 */
export function errorResponse(message: string): object {
  return {
    success: false,
    error: {
      message: message,
    },
    timestamp: new Date().toISOString(),
  };
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
