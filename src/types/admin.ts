export interface DatabaseConfig {
  enabled: boolean;
  settings: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    connectionLimit: number;
    multipleStatements: boolean;
    timezone: string;
    dateStrings: boolean;
  };
}

export interface DatabaseStatus {
  connected: boolean;
  poolSize: number;
  activeConnections: number;
  idleConnections: number;
}

// Rest of admin types...