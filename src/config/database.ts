import { openDB, type IDBPDatabase } from 'idb';
import { z } from 'zod';

const dbConfigSchema = z.object({
  name: z.string().default('innovation_network'),
  version: z.number().default(1),
  stores: z.array(z.string()).default([
    'users',
    'actions', 
    'networks',
    'centers',
    'departments',
    'families',
    'objectives',
    'centerObjectives',
    'ods'
  ])
});

export class DatabaseManager {
  private static instance: DatabaseManager;
  private db: IDBPDatabase | null = null;
  private config: z.infer<typeof dbConfigSchema> | null = null;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async initialize(env: 'development' | 'production' = 'development'): Promise<void> {
    try {
      this.config = dbConfigSchema.parse({
        name: `${env}_innovation_network`,
        version: 1,
        stores: [
          'users',
          'actions',
          'networks', 
          'centers',
          'departments',
          'families',
          'objectives',
          'centerObjectives',
          'ods'
        ]
      });

      this.db = await openDB(this.config.name, this.config.version, {
        upgrade(db) {
          // Create object stores if they don't exist
          for (const store of dbConfigSchema.parse({}).stores) {
            if (!db.objectStoreNames.contains(store)) {
              db.createObjectStore(store, { keyPath: 'id', autoIncrement: true });
            }
          }
        },
      });

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.config = null;
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      if (!this.db) return false;
      const tx = this.db.transaction('users', 'readonly');
      await tx.done;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  public async getStatus(): Promise<{
    connected: boolean;
    poolSize: number;
    activeConnections: number;
    idleConnections: number;
  }> {
    const isConnected = await this.testConnection();
    
    return {
      connected: isConnected,
      poolSize: 1, // IndexedDB uses a single connection
      activeConnections: isConnected ? 1 : 0,
      idleConnections: 0
    };
  }

  public async get<T>(store: string, key: string): Promise<T | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.get(store, key);
  }

  public async getAll<T>(store: string): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.getAll(store);
  }

  public async put<T>(store: string, value: T): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.put(store, value);
  }

  public async delete(store: string, key: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.delete(store, key);
  }

  public async clear(store: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.clear(store);
  }

  public async transaction<T>(
    stores: string[],
    mode: 'readonly' | 'readwrite',
    callback: (tx: IDBPDatabase) => Promise<T>
  ): Promise<T> {
    if (!this.db) throw new Error('Database not initialized');
    
    const tx = this.db.transaction(stores, mode);
    try {
      const result = await callback(this.db);
      await tx.done;
      return result;
    } catch (error) {
      tx.abort();
      throw error;
    }
  }
}

export const db = DatabaseManager.getInstance();