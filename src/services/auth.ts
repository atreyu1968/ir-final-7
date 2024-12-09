import { mockUsers } from '../data/mockUsers';
import type { User } from '../types/user';
import type { LoginCredentials, RegistrationData } from '../types/auth';
import { generateRecoveryCode } from '../utils/codeGenerator';

export const authenticateUser = async (credentials: LoginCredentials): Promise<User | null> => {
  // Check for admin credentials first
  if (
    credentials.email === import.meta.env.VITE_ADMIN_EMAIL &&
    credentials.password === import.meta.env.VITE_ADMIN_PASSWORD
  ) {
    return {
      id: 'admin-001',
      name: 'Administrador',
      lastName: 'Sistema',
      medusaCode: 'ADMIN2024',
      email: import.meta.env.VITE_ADMIN_EMAIL,
      center: 'Administración Central',
      network: 'RED-INNOVA-1',
      role: 'admin',
      imageUrl: 'https://ui-avatars.com/api/?name=Administrador+Sistema&background=0D47A1&color=fff',
    };
  }

  // Check mock users
  const user = mockUsers.find(user => user.email === credentials.email);
  if (!user) return null;

  // If password matches Medusa code and change is required, allow login
  if (user.passwordChangeRequired && credentials.password === user.medusaCode) {
    return user;
  }
  
  // Otherwise check actual password
  if (credentials.password === user.medusaCode) {
    return user;
  }
  
  return null;
};

export const registerUser = async (data: RegistrationData): Promise<User | null> => {
  // Check if email already exists
  const existingUser = mockUsers.find(user => user.email === data.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Create new user
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name,
    lastName: data.lastName,
    medusaCode: data.medusaCode,
    email: data.email,
    phone: data.phone,
    center: data.center,
    network: '', // Will be set based on center
    role: 'manager',
    passwordChangeRequired: true,
  };

  mockUsers.push(newUser);
  return newUser;
};

export const getRecoveryCode = async (email: string): Promise<string | null> => {
  const user = mockUsers.find(user => user.email === email);
  if (!user) return null;

  const code = generateRecoveryCode();
  user.recoveryCode = code;
  user.recoveryCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  user.recoveryAttempts = 0;

  return code;
};

export const verifyRecoveryCode = async (email: string, code: string): Promise<boolean> => {
  const user = mockUsers.find(user => user.email === email);
  if (!user || !user.recoveryCode || !user.recoveryCodeExpires) return false;

  // Check if code has expired
  if (new Date() > user.recoveryCodeExpires) {
    user.recoveryCode = undefined;
    user.recoveryCodeExpires = undefined;
    return false;
  }

  // Increment attempts
  user.recoveryAttempts = (user.recoveryAttempts || 0) + 1;

  // Max 3 attempts
  if (user.recoveryAttempts >= 3) {
    user.recoveryCode = undefined;
    user.recoveryCodeExpires = undefined;
    return false;
  }

  return code === user.recoveryCode;
};

export const resetPassword = async (email: string, code: string, newPassword: string): Promise<boolean> => {
  const user = mockUsers.find(user => user.email === email);
  if (!user || !user.recoveryCode || code !== user.recoveryCode) return false;

  // Check if code has expired
  if (user.recoveryCodeExpires && new Date() > user.recoveryCodeExpires) {
    user.recoveryCode = undefined;
    user.recoveryCodeExpires = undefined;
    return false;
  }

  // Update password and clear recovery code
  user.medusaCode = newPassword;
  user.recoveryCode = undefined;
  user.recoveryCodeExpires = undefined;
  user.passwordChangeRequired = false;

  return true;
};