import { mockUsers } from '../../data/mockUsers';
import type { User } from '../../types/user';

// For now, use mock data instead of real database
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = mockUsers.find(u => u.email === email);
    return user || null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
};

export const findUserById = async (id: string): Promise<User | null> => {
  try {
    const user = mockUsers.find(u => u.id === id);
    return user || null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User | null> => {
  try {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
    };
    mockUsers.push(newUser);
    return newUser;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
};

export const updateUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
  try {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      medusaCode: newPassword,
      passwordChangeRequired: false,
    };

    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
};

export const updateRecoveryCode = async (
  userId: string, 
  code: string | null,
  expiresAt: Date | null,
  attempts: number = 0
): Promise<boolean> => {
  try {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      recoveryCode: code,
      recoveryCodeExpires: expiresAt?.toISOString(),
      recoveryAttempts: attempts,
    };

    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
};