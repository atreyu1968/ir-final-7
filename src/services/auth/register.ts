import { findUserByEmail, createUser } from './db';
import type { RegistrationData } from '../../types/auth';
import type { User } from '../../types/user';

export const registerUser = async (data: RegistrationData): Promise<User | null> => {
  try {
    // Check if email already exists
    const existingUser = await findUserByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser = await createUser({
      name: data.name,
      lastName: data.lastName,
      medusaCode: data.medusaCode,
      email: data.email,
      phone: data.phone,
      center: data.center,
      network: '', // Will be set based on center
      role: 'manager',
      passwordChangeRequired: true,
    });

    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};