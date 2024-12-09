import { findUserByEmail } from './db';
import { env } from '../../config/env';
import type { LoginCredentials } from '../../types/auth';
import type { User } from '../../types/user';

export const authenticateUser = async (credentials: LoginCredentials): Promise<User | null> => {
  // Check for admin credentials first
  if (
    credentials.email === env.VITE_ADMIN_EMAIL &&
    credentials.password === env.VITE_ADMIN_PASSWORD
  ) {
    return {
      id: 'admin-001',
      name: 'Administrador',
      lastName: 'Sistema',
      medusaCode: 'ADMIN2024',
      email: env.VITE_ADMIN_EMAIL,
      center: 'Administración Central',
      network: 'RED-INNOVA-1',
      role: 'admin',
      imageUrl: 'https://ui-avatars.com/api/?name=Administrador+Sistema&background=0D47A1&color=fff',
    };
  }

  // Find user in database or mock data
  const user = await findUserByEmail(credentials.email);
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