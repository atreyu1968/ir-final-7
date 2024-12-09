import { findUserByEmail, updateRecoveryCode, updateUserPassword } from './db';
import { generateRecoveryCode } from '../../utils/codeGenerator';

export const getRecoveryCode = async (email: string): Promise<string | null> => {
  try {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const code = generateRecoveryCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const success = await updateRecoveryCode(user.id, code, expiresAt, 0);
    return success ? code : null;
  } catch (error) {
    console.error('Recovery code error:', error);
    return null;
  }
};

export const verifyRecoveryCode = async (email: string, code: string): Promise<boolean> => {
  try {
    const user = await findUserByEmail(email);
    if (!user || !user.recoveryCode || !user.recoveryCodeExpires) return false;

    // Check if code has expired
    if (new Date() > new Date(user.recoveryCodeExpires)) {
      await updateRecoveryCode(user.id, null, null);
      return false;
    }

    // Increment attempts
    const attempts = (user.recoveryAttempts || 0) + 1;

    // Max 3 attempts
    if (attempts >= 3) {
      await updateRecoveryCode(user.id, null, null);
      return false;
    }

    await updateRecoveryCode(user.id, user.recoveryCode, user.recoveryCodeExpires, attempts);
    return code === user.recoveryCode;
  } catch (error) {
    console.error('Code verification error:', error);
    return false;
  }
};

export const resetPassword = async (email: string, code: string, newPassword: string): Promise<boolean> => {
  try {
    const user = await findUserByEmail(email);
    if (!user || !user.recoveryCode || code !== user.recoveryCode) return false;

    // Check if code has expired
    if (user.recoveryCodeExpires && new Date() > new Date(user.recoveryCodeExpires)) {
      await updateRecoveryCode(user.id, null, null);
      return false;
    }

    // Update password and clear recovery code
    const success = await Promise.all([
      updateUserPassword(user.id, newPassword),
      updateRecoveryCode(user.id, null, null)
    ]);

    return success.every(Boolean);
  } catch (error) {
    console.error('Password reset error:', error);
    return false;
  }
};