import { executeQuery } from './connection';
import type { AuditLog } from '../../types/admin';

export const auditQueries = {
  create: `
    INSERT INTO audit_logs (id, userId, action, details)
    VALUES (?, ?, ?, ?)
  `,
  findByUser: 'SELECT * FROM audit_logs WHERE userId = ? ORDER BY timestamp DESC LIMIT ?',
  findByAction: 'SELECT * FROM audit_logs WHERE action = ? ORDER BY timestamp DESC LIMIT ?',
};

export const createAuditLog = async (log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> => {
  await executeQuery(auditQueries.create, [
    `log-${Date.now()}`,
    log.userId,
    log.action,
    JSON.stringify(log.details),
  ]);
};

export const findUserAuditLogs = async (userId: string, limit: number = 100): Promise<AuditLog[]> => {
  return executeQuery<AuditLog[]>(auditQueries.findByUser, [userId, limit]);
};

export const findActionAuditLogs = async (action: string, limit: number = 100): Promise<AuditLog[]> => {
  return executeQuery<AuditLog[]>(auditQueries.findByAction, [action, limit]);
};