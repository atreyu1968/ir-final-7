import { create } from 'zustand';
import { db } from '../config/database';
import type { DatabaseConfig } from '../types/admin';

interface DatabaseConfigState {
  config: DatabaseConfig;
  status: {
    connected: boolean;
    poolSize: number;
    activeConnections: number;
    idleConnections: number;
  };
  updateConfig: (config: DatabaseConfig) => Promise<void>;
  testConnection: () => Promise<boolean>;
  refreshStatus: () => Promise<void>;
}

const defaultConfig: DatabaseConfig = {
  enabled: false,
  settings: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10
    }
  }
};

export const useDatabaseConfigStore = create<DatabaseConfigState>((set, get) => ({
  config: defaultConfig,
  status: {
    connected: false,
    poolSize: 0,
    activeConnections: 0,
    idleConnections: 0
  },
  
  updateConfig: async (config) => {
    try {
      if (config.enabled) {
        await db.initialize(process.env.NODE_ENV === 'production' ? 'production' : 'development');
      } else {
        await db.close();
      }
      
      set({ config });
      localStorage.setItem('databaseConfig', JSON.stringify(config));
      
      // Update status after config change
      const status = await db.getStatus();
      set({ status });
    } catch (error) {
      console.error('Error updating database config:', error);
      throw error;
    }
  },
  
  testConnection: async () => {
    try {
      return await db.testConnection();
    } catch (error) {
      console.error('Error testing database connection:', error);
      return false;
    }
  },
  
  refreshStatus: async () => {
    try {
      const status = await db.getStatus();
      set({ status });
    } catch (error) {
      console.error('Error refreshing database status:', error);
      set({
        status: {
          connected: false,
          poolSize: 0,
          activeConnections: 0,
          idleConnections: 0
        }
      });
    }
  }
}));