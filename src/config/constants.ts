export const ADMIN_CODE = 'ADMIN2024';

export const DEFAULT_ADMIN_USER = {
  id: 'admin-001',
  name: 'Administrador',
  lastName: 'Sistema',
  medusaCode: ADMIN_CODE,
  email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@redinnovacionfp.es',
  center: 'Administración Central',
  network: 'RED-INNOVA-1',
  role: 'admin' as const,
};