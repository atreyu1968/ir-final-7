import { jwtConfig } from '../config/jwt';
import type { User } from '../types/user';

interface TokenPayload {
  userId: string;
  role: User['role'];
  network?: string;
  center?: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const generateTokens = (user: User): TokenResponse => {
  const payload: TokenPayload = {
    userId: user.id,
    role: user.role,
    network: user.network,
    center: user.center,
  };

  // Calculate expiration timestamps
  const now = Math.floor(Date.now() / 1000);
  const accessExpiresIn = parseTimeString(jwtConfig.expiresIn);
  const refreshExpiresIn = parseTimeString(jwtConfig.refreshExpiresIn);

  // Generate tokens
  const accessToken = sign({
    ...payload,
    exp: now + accessExpiresIn,
    iat: now,
  });

  const refreshToken = sign({
    userId: user.id,
    tokenVersion: 1, // For token revocation
    exp: now + refreshExpiresIn,
    iat: now,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: accessExpiresIn,
  };
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = verify(token);
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const refreshAccessToken = (refreshToken: string): TokenResponse | null => {
  try {
    const decoded = verify(refreshToken);
    if (!decoded || !decoded.userId) return null;

    // Here you would typically:
    // 1. Verify token version against database
    // 2. Get fresh user data
    // 3. Generate new tokens

    return generateTokens({
      id: decoded.userId,
      // ... other user data would come from database
    } as User);
  } catch (error) {
    return null;
  }
};

// Helper function to sign tokens
const sign = (payload: object): string => {
  // In production, use a proper JWT library
  return Buffer.from(JSON.stringify({
    ...payload,
    alg: jwtConfig.algorithm,
    iss: jwtConfig.issuer,
  })).toString('base64');
};

// Helper function to verify tokens
const verify = (token: string): any => {
  try {
    // In production, use a proper JWT library
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (decoded.iss !== jwtConfig.issuer) {
      throw new Error('Invalid issuer');
    }
    
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Helper to parse time strings like '24h', '7d' to seconds
const parseTimeString = (timeStr: string): number => {
  const unit = timeStr.slice(-1);
  const value = parseInt(timeStr.slice(0, -1));
  
  switch (unit) {
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return value;
  }
};