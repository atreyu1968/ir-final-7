import { create } from 'zustand';
import type { DocsConfig } from '../types/admin';

interface DocsConfigState {
  config: DocsConfig;
  initializeStore: () => void;
  updateConfig: (config: DocsConfig) => void;
  testConnection: () => Promise<boolean>;
}

const defaultConfig: DocsConfig = {
  settings: {
    url: 'http://localhost:4000',
    title: 'Red de Innovación FP',
    description: 'Documentación oficial del sistema',
    theme: {
      primaryColor: '#2563eb',
      accentColor: '#8b5cf6',
    },
  },
  enabled: true,
};

export const useDocsConfigStore = create<DocsConfigState>((set, get) => ({
  config: defaultConfig,
  
  initializeStore: () => {
    const savedConfig = localStorage.getItem('docsConfig');
    if (savedConfig) {
      set({ config: JSON.parse(savedConfig) });
    }
  },
  
  updateConfig: (config) => {
    set({ config });
    localStorage.setItem('docsConfig', JSON.stringify(config));
    
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/admin/config/docs', {
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
      throw new Error('La documentación no está habilitada');
    }

    if (!config.settings.url) {
      throw new Error('La URL de GitBook es requerida');
    }

    try {
      const response = await fetch(config.settings.url);
      return response.ok;
    } catch (error) {
      console.error('Error testing docs connection:', error);
      return false;
    }
  },
}));