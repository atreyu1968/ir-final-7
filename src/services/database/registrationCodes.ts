import { executeQuery } from './connection';
import type { RegistrationCode } from '../../types/registrationCode';

export const registrationCodeQueries = {
  create: `
    INSERT INTO registration_codes (
      id, code, role, expirationDate, maxUses, 
      network, center, isActive
    ) VALUES (?, ?, ?, ?, ?, ?, ?, true)
  `,
  findByCode: 'SELECT * FROM registration_codes WHERE code = ?',
  incrementUses: 'UPDATE registration_codes SET usedCount = usedCount + 1 WHERE code = ?',
  cleanExpired: 'DELETE FROM registration_codes WHERE expirationDate < NOW() OR usedCount >= maxUses',
};

export const createRegistrationCode = async (code: Omit<RegistrationCode, 'id' | 'usedCount' | 'createdAt'>): Promise<RegistrationCode> => {
  const result = await executeQuery(registrationCodeQueries.create, [
    `code-${Date.now()}`,
    code.code,
    code.role,
    code.expirationDate,
    code.maxUses,
    code.network,
    code.center,
  ]);

  return {
    ...code,
    id: result.insertId,
    usedCount: 0,
    createdAt: new Date().toISOString(),
  };
};

export const findRegistrationCode = async (code: string): Promise<RegistrationCode | null> => {
  const codes = await executeQuery<RegistrationCode[]>(registrationCodeQueries.findByCode, [code]);
  return codes[0] || null;
};

export const incrementCodeUses = async (code: string): Promise<boolean> => {
  const result = await executeQuery(registrationCodeQueries.incrementUses, [code]);
  return result.affectedRows > 0;
};

export const cleanExpiredCodes = async (): Promise<void> => {
  await executeQuery(registrationCodeQueries.cleanExpired);
};