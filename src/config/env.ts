import { z } from 'zod';

const envSchema = z.object({
  // Database
  VITE_DB_HOST: z.string().default('db'),
  VITE_DB_PORT: z.string().default('3306'),
  VITE_DB_USER: z.string().default('innovation_user'),
  VITE_DB_PASSWORD: z.string().default('Prod2024Secure!'),
  VITE_DB_NAME: z.string().default('innovation_network'),
  
  // Admin credentials
  VITE_ADMIN_EMAIL: z.string().default('admin@redinnovacionfp.es'),
  VITE_ADMIN_PASSWORD: z.string().default('Admin2024Secure!'),
  
  // Application
  VITE_NODE_ENV: z.string().default('production'),
  VITE_PORT: z.string().default('3000'),
  VITE_DOMAIN: z.string().default('192.168.1.37'),
  VITE_PROTOCOL: z.string().default('http'),
});

export const env = envSchema.parse(import.meta.env);