import { create } from 'zustand';
import type { ForumConfig } from '../types/admin';

interface ForumConfigState {
  config: ForumConfig;
  updateConfig: (config: ForumConfig) => void;
  testConnection: () => Promise<boolean>;
}

const defaultConfig: ForumConfig = {
  provider: 'discourse',
  settings: {
    url: '',
    apiKey: '',
    ssoSecret: '',
    category: 'general',
    defaultTags: ['innovacion-fp'],
  },
  enabled: false,
};

export const useForumConfigStore = create<ForumConfigState>((set, get) => ({
  config: defaultConfig,
  
  updateConfig: (config) => {
    set({ config });
    localStorage.setItem('forumConfig', JSON.stringify(config));
  },
  
  testConnection: async () => {
    const { config } = get();
    
    // Validate required settings
    if (!config.settings.url) {
      throw new Error('La URL del servidor es requerida');
    }

    if (!config.settings.apiKey) {
      throw new Error('La API key es requerida');
    }

    try {
      // Try to connect to the server
      const response = await fetch(`${config.settings.url}/site/basic-info.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': config.settings.apiKey,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error testing forum connection:', error);
      return false;
    }
  },
}));