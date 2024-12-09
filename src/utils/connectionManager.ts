import { checkDatabaseConnection } from '../config/database';

interface ConnectionStatus {
  database: boolean;
  lastCheck: Date;
}

class ConnectionManager {
  private static instance: ConnectionManager;
  private status: ConnectionStatus = {
    database: false,
    lastCheck: new Date(),
  };
  private checkInterval: number = 30000; // 30 seconds
  private intervalId?: NodeJS.Timeout;

  private constructor() {
    this.startMonitoring();
  }

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  private async checkConnections(): Promise<void> {
    try {
      const dbStatus = await checkDatabaseConnection();
      
      this.status = {
        database: dbStatus,
        lastCheck: new Date(),
      };

      if (!dbStatus) {
        console.error('Database connection check failed');
        // Here you could implement retry logic or notifications
      }
    } catch (error) {
      console.error('Error checking connections:', error);
      this.status.database = false;
    }
  }

  private startMonitoring(): void {
    // Initial check
    this.checkConnections();

    // Regular checks
    this.intervalId = setInterval(() => {
      this.checkConnections();
    }, this.checkInterval);
  }

  public stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public getStatus(): ConnectionStatus {
    return { ...this.status };
  }

  public async forceCheck(): Promise<ConnectionStatus> {
    await this.checkConnections();
    return this.getStatus();
  }

  public setCheckInterval(interval: number): void {
    this.checkInterval = interval;
    this.stopMonitoring();
    this.startMonitoring();
  }
}

export const connectionManager = ConnectionManager.getInstance();