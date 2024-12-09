import { executeQuery, transaction } from './connection';
import type { User } from '../../types/user';

export const userQueries = {
  findByEmail: 'SELECT * FROM users WHERE email = ?',
  findById: 'SELECT * FROM users WHERE id = ?',
  create: `
    INSERT INTO users (
      name, lastName, medusaCode, email, phone, 
      center, network, role, imageUrl, passwordChangeRequired
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true)
  `,
  updatePassword: `
    UPDATE users 
    SET medusaCode = ?, passwordChangeRequired = false 
    WHERE id = ?
  `,
  updateRecoveryCode: `
    UPDATE users 
    SET recoveryCode = ?, 
        recoveryCodeExpires = ?, 
        recoveryAttempts = ? 
    WHERE id = ?
  `,
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const users = await executeQuery<User[]>(userQueries.findByEmail, [email]);
  return users[0] || null;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const users = await executeQuery<User[]>(userQueries.findById, [id]);
  return users[0] || null;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  return transaction(async (conn) => {
    const result = await conn.query(userQueries.create, [
      user.name,
      user.lastName,
      user.medusaCode,
      user.email,
      user.phone,
      user.center,
      user.network,
      user.role,
      user.imageUrl,
    ]);

    return {
      id: result.insertId,
      ...user,
    };
  });
};

export const updateUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
  const result = await executeQuery(userQueries.updatePassword, [newPassword, userId]);
  return result.affectedRows > 0;
};

export const updateRecoveryCode = async (
  userId: string,
  code: string | null,
  expiresAt: Date | null,
  attempts: number = 0
): Promise<boolean> => {
  const result = await executeQuery(userQueries.updateRecoveryCode, [
    code,
    expiresAt,
    attempts,
    userId,
  ]);
  return result.affectedRows > 0;
};