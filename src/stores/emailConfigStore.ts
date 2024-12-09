import { create } from 'zustand';
import type { EmailConfig } from '../types/admin';

interface EmailConfigState {
  config: EmailConfig;
  updateConfig: (config: EmailConfig) => void;
  testConnection: () => Promise<boolean>;
}

const defaultConfig: EmailConfig = {
  provider: 'smtp',
  settings: {
    host: '',
    port: 587,
    secure: true,
    username: '',
    password: '',
    fromName: 'Red de Innovación FP',
    fromEmail: 'noreply@redinnovacionfp.es',
  },
  enabled: false,
};

export const useEmailConfigStore = create<EmailConfigState>((set, get) => ({
  config: defaultConfig,
  
  updateConfig: (config) => {
    set({ config });
    
    // Persistir la configuración en localStorage
    localStorage.setItem('emailConfig', JSON.stringify(config));
    
    // En producción, aquí se haría una llamada a la API para guardar en base de datos
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/admin/config/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      }).catch(console.error);
    }
  },
  
  testConnection: async () => {
    const { config } = get();
    
    if (!config.enabled) {
      throw new Error('El servicio de correo no está habilitado');
    }

    if (!config.settings.host || !config.settings.username || !config.settings.password) {
      throw new Error('Faltan datos de configuración del servidor de correo');
    }

    try {
      // En producción, esto haría una llamada real al servidor SMTP
      const response = await fetch('/api/admin/config/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config.settings),
      });

      return response.ok;
    } catch (error) {
      console.error('Error testing email connection:', error);
      return false;
    }
  },
}));