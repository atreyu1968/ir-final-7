export type UserRole = 'admin' | 'general_coordinator' | 'subnet_coordinator' | 'manager' | 'guest';

export interface User {
  id: string;
  name: string;
  lastName: string;
  medusaCode: string;
  email: string;
  phone?: string;
  center?: string; // Make center optional
  network?: string; // Make network optional
  role: UserRole;
  imageUrl?: string;
  passwordChangeRequired?: boolean;
  password?: string;
}

export interface UserFormData extends Omit<User, 'id'> {
  password?: string;
}