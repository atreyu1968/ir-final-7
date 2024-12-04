import mariadb from 'mariadb';
import { z } from 'zod';

// Schema for database configuration validation
const dbConfigSchema = z.object({
  host: z.string(),
  port: z.number(),
  user: z.string(),
  password: z.string(),
  database: z.string(),
  connectionLimit: z.number(),
  acquireTimeout: z.number().default(30000),
  connectTimeout: z.number().default(10000),
  waitForConnections: z.boolean().default(true),
  queueLimit: z.number().default(0),
  ssl: z.object({
    rejectUnauthorized: z.boolean(),
  }).optional(),
});

// Environment-specific database configurations
const configs = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'innovation_user',
    password: process.env.DB_PASSWORD || 'Dev2024Secure!',
    database: process.env.DB_NAME || 'innovation_network',
    connectionLimit: 5,
    acquireTimeout: 30000,
    connectTimeout: 10000,
    waitForConnections: true,
    queueLimit: 0,
  },
  production: {
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'innovation_user',
    password: process.env.DB_PASSWORD || 'Prod2024Secure!',
    database: process.env.DB_NAME || 'innovation_network',
    connectionLimit: 10,
    acquireTimeout: 60000,
    connectTimeout: 20000,
    waitForConnections: true,
    queueLimit: 0,
    ssl: {
      rejectUnauthorized: true
    }
  },
  test: {
    host: 'localhost',
    port: 3306,
    user: 'test_user',
    password: 'Test2024Secure!',
    database: 'innovation_network_test',
    connectionLimit: 2,
    acquireTimeout: 10000,
    connectTimeout: 5000,
    waitForConnections: true,
    queueLimit: 0,
  },
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Validate configuration
const dbConfig = dbConfigSchema.parse(configs[env as keyof typeof configs]);

// Create connection pool
const pool = mariadb.createPool(dbConfig);

// Query execution with automatic connection management
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

// Transaction execution with automatic rollback on error
export const transaction = async <T>(
  callback: (conn: mariadb.Connection) => Promise<T>
): Promise<T> => {
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
    await conn.query('SELECT 1');
    return true;
  } catch (err) {
    console.error('Database health check failed:', err);
    return false;
  } finally {
    if (conn) conn.release();
  }
};

// Export pool for direct access if needed
export const getPool = () => pool;