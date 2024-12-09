import { create } from 'zustand';
import type { CollaborationConfig } from '../types/admin';

interface CollaborationConfigState {
  config: CollaborationConfig;
  updateConfig: (config: CollaborationConfig) => void;
  testConnection: () => Promise<boolean>;
}

const defaultConfig: CollaborationConfig = {
  provider: 'nextcloud',
  settings: {
    url: '',
    adminUser: '',
    adminPassword: '',
    defaultQuota: '5GB',
    defaultGroup: 'innovacion-fp',
    ssoSecret: '',
  },
  enabled: false,
};

export const useCollaborationConfigStore = create<CollaborationConfigState>((set, get) => ({
  config: defaultConfig,
  
  updateConfig: (config) => {
    set({ config });
    localStorage.setItem('collaborationConfig', JSON.stringify(config));
  },
  
  testConnection: async () => {
    const { config } = get();
    
    // Validate required settings
    if (!config.settings.url) {
      throw new Error('La URL del servidor es requerida');
    }

    if (!config.settings.adminUser || !config.settings.adminPassword) {
      throw new Error('Las credenciales de administrador son requeridas');
    }

    try {
      // Try to connect to the server
      const response = await fetch(`${config.settings.url}/status.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error testing collaboration connection:', error);
      return false;
    }
  },
}));