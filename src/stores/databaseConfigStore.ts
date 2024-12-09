import { create } from 'zustand';
import type { DatabaseConfig } from '../types/admin';

interface DatabaseConfigState {
  config: DatabaseConfig;
  updateConfig: (config: DatabaseConfig) => void;
  testConnection: () => Promise<boolean>;
}

const defaultConfig: DatabaseConfig = {
  enabled: false,
  settings: {
    url: '/phpmyadmin',
    allowRoot: false,
    maxExecutionTime: 600,
    uploadLimit: '50M',
    memoryLimit: '256M',
    theme: 'pmahomme',
    defaultLanguage: 'es',
    showServerInfo: false,
    showPhpInfo: false,
    showGitRevision: false,
  },
};

export const useDatabaseConfigStore = create<DatabaseConfigState>((set, get) => ({
  config: defaultConfig,
  
  updateConfig: (config) => {
    set({ config });
    localStorage.setItem('databaseConfig', JSON.stringify(config));
  },
  
  testConnection: async () => {
    const { config } = get();
    
    if (!config.enabled) {
      throw new Error('Database management is not enabled');
    }

    try {
      const response = await fetch(`${config.settings.url}/ping`);
      return response.ok;
    } catch (error) {
      console.error('Error testing database connection:', error);
      return false;
    }
  },
}));