import { z } from 'zod';
import { env } from './env';
import mariadb from 'mariadb';

// Schema for database configuration validation
const dbConfigSchema = z.object({
  host: z.string(),
  port: z.number(),
  user: z.string(),
  password: z.string(),
  database: z.string(),
  connectionLimit: z.number(),
});

// Get configuration from environment
const config = {
  host: env.VITE_DB_HOST,
  port: parseInt(env.VITE_DB_PORT),
  user: env.VITE_DB_USER,
  password: env.VITE_DB_PASSWORD,
  database: env.VITE_DB_NAME,
  connectionLimit: 10,
};

// Validate configuration
export const dbConfig = dbConfigSchema.parse(config);

// Create connection pool
const pool = mariadb.createPool(dbConfig);

// Query execution with error handling
export const executeQuery = async <T>(query: string, params?: any[]): Promise<T> => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(query, params);
    return result as T;
  } catch (err) {
    console.error('Database error:', err);
    throw new Error('Error executing database query');
  } finally {
    if (conn) conn.release();
  }
};

// Transaction support
export const transaction = async <T>(callback: (conn: mariadb.Connection) => Promise<T>): Promise<T> => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('Transaction error:', err);
    throw new Error('Error executing database transaction');
  } finally {
    if (conn) conn.release();
  }
};

// Health check function
export const checkDatabaseConnection = async (): Promise<boolean> => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.ping();
    return true;
  } catch (err) {
    console.error('Database health check failed:', err);
    return false;
  } finally {
    if (conn) conn.release();
  }
};

export default {
  config: dbConfig,
  executeQuery,
  transaction,
  checkDatabaseConnection,
};