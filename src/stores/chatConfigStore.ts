import { create } from 'zustand';
import type { ChatConfig } from '../types/admin';

interface ChatConfigState {
  config: ChatConfig;
  updateConfig: (config: ChatConfig) => void;
  testConnection: () => Promise<boolean>;
}

const defaultConfig: ChatConfig = {
  provider: 'rocketchat',
  settings: {
    url: '',
    adminUser: 'admin',
    adminPassword: '',
    defaultChannel: 'general',
    ssoSecret: '',
  },
  enabled: false,
};

export const useChatConfigStore = create<ChatConfigState>((set, get) => ({
  config: defaultConfig,
  
  updateConfig: (config) => {
    set({ config });
    localStorage.setItem('chatConfig', JSON.stringify(config));
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
      const response = await fetch(`${config.settings.url}/api/v1/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error testing chat connection:', error);
      return false;
    }
  },
}));