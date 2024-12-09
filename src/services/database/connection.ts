import mariadb from 'mariadb';
import { env } from '../../config/env';

const pool = mariadb.createPool({
  host: env.VITE_DB_HOST,
  port: parseInt(env.VITE_DB_PORT),
  user: env.VITE_DB_USER,
  password: env.VITE_DB_PASSWORD,
  database: env.VITE_DB_NAME,
  connectionLimit: 10,
});

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

export const testConnection = async (): Promise<boolean> => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.ping();
    return true;
  } catch (err) {
    console.error('Database connection test failed:', err);
    return false;
  } finally {
    if (conn) conn.release();
  }
};

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