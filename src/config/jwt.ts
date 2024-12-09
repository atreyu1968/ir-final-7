import { z } from 'zod';

// Schema for JWT configuration validation
const jwtConfigSchema = z.object({
  secret: z.string().min(32),
  expiresIn: z.string().default('24h'),
  refreshExpiresIn: z.string().default('7d'),
  algorithm: z.enum(['HS256', 'HS384', 'HS512']).default('HS512'),
  issuer: z.string().default('redinnovacionfp.es'),
});

// Environment-specific JWT configurations
const configs = {
  development: {
    secret: process.env.JWT_SECRET || 'dev_2024SecureToken!X9v$mK#pL@Q5r*N3',
    expiresIn: '24h',
    refreshExpiresIn: '7d',
    algorithm: 'HS512' as const,
    issuer: 'redinnovacionfp.es',
  },
  production: {
    secret: process.env.JWT_SECRET || 'prod_2024SecureToken!Y8w$nJ#qM@P4s*M2',
    expiresIn: '12h', // More restrictive in production
    refreshExpiresIn: '5d',
    algorithm: 'HS512' as const,
    issuer: 'redinnovacionfp.es',
  },
  test: {
    secret: 'test_2024SecureToken!Z7t$nL#rK@W3x*B9',
    expiresIn: '1h',
    refreshExpiresIn: '1d',
    algorithm: 'HS512' as const,
    issuer: 'redinnovacionfp.es',
  },
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Validate and export configuration
export const jwtConfig = jwtConfigSchema.parse(configs[env as keyof typeof configs]);