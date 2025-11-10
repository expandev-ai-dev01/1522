/**
 * @summary
 * Zod validation utilities.
 * Provides reusable validation schemas and helpers.
 *
 * @module utils/zodValidation
 */

import { z } from 'zod';

/**
 * @constant zString
 * @description Standard string validation
 */
export const zString = z.string().min(1);

/**
 * @constant zNullableString
 * @description Nullable string validation with max length
 */
export const zNullableString = (maxLength?: number) => {
  let schema = z.string();
  if (maxLength) {
    schema = schema.max(maxLength);
  }
  return schema.nullable();
};

/**
 * @constant zName
 * @description Name field validation (1-200 characters)
 */
export const zName = z.string().min(1).max(200);

/**
 * @constant zNullableDescription
 * @description Description field validation (max 500 characters, nullable)
 */
export const zNullableDescription = z.string().max(500).nullable();

/**
 * @constant zFK
 * @description Foreign key validation (positive integer)
 */
export const zFK = z.coerce.number().int().positive();

/**
 * @constant zNullableFK
 * @description Nullable foreign key validation
 */
export const zNullableFK = z.coerce.number().int().positive().nullable();

/**
 * @constant zBit
 * @description Bit/boolean validation (0 or 1)
 */
export const zBit = z.coerce.number().int().min(0).max(1);

/**
 * @constant zDateString
 * @description Date string validation
 */
export const zDateString = z.string().datetime();
