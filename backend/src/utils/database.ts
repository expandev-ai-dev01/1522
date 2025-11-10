/**
 * @summary
 * Database utility functions.
 * Provides database connection and query execution helpers.
 *
 * @module utils/database
 */

import sql from 'mssql';
import { config } from '@/config';

/**
 * @enum ExpectedReturn
 * @description Expected return types for database operations
 */
export enum ExpectedReturn {
  Single = 'single',
  Multi = 'multi',
  None = 'none',
}

let pool: sql.ConnectionPool | null = null;

/**
 * @function getPool
 * @description Gets or creates database connection pool
 *
 * @returns {Promise<sql.ConnectionPool>} Database connection pool
 */
export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(config.database);
  }
  return pool;
}

/**
 * @function dbRequest
 * @description Executes stored procedure with parameters
 *
 * @param {string} procedure - Stored procedure name
 * @param {object} parameters - Procedure parameters
 * @param {ExpectedReturn} expectedReturn - Expected return type
 * @param {sql.Transaction} [transaction] - Optional transaction
 * @param {string[]} [resultSetNames] - Optional result set names
 * @returns {Promise<any>} Query results
 */
export async function dbRequest(
  procedure: string,
  parameters: { [key: string]: any },
  expectedReturn: ExpectedReturn,
  transaction?: sql.Transaction,
  resultSetNames?: string[]
): Promise<any> {
  const currentPool = await getPool();
  const request = transaction ? new sql.Request(transaction) : currentPool.request();

  for (const [key, value] of Object.entries(parameters)) {
    request.input(key, value);
  }

  const result = await request.execute(procedure);

  if (expectedReturn === ExpectedReturn.None) {
    return null;
  }

  if (expectedReturn === ExpectedReturn.Single) {
    return result.recordset[0];
  }

  if (expectedReturn === ExpectedReturn.Multi) {
    if (resultSetNames && resultSetNames.length > 0) {
      const namedResults: { [key: string]: any[] } = {};
      resultSetNames.forEach((name, index) => {
        const recordset = Array.isArray(result.recordsets)
          ? result.recordsets[index]
          : result.recordsets[name];
        namedResults[name] = recordset || [];
      });
      return namedResults;
    }
    return result.recordsets;
  }

  return result.recordset;
}

/**
 * @function beginTransaction
 * @description Begins a new database transaction
 *
 * @returns {Promise<sql.Transaction>} Transaction object
 */
export async function beginTransaction(): Promise<sql.Transaction> {
  const currentPool = await getPool();
  const transaction = new sql.Transaction(currentPool);
  await transaction.begin();
  return transaction;
}

/**
 * @function commitTransaction
 * @description Commits a database transaction
 *
 * @param {sql.Transaction} transaction - Transaction to commit
 * @returns {Promise<void>}
 */
export async function commitTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.commit();
}

/**
 * @function rollbackTransaction
 * @description Rolls back a database transaction
 *
 * @param {sql.Transaction} transaction - Transaction to rollback
 * @returns {Promise<void>}
 */
export async function rollbackTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.rollback();
}
