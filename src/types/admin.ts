// Previous interfaces remain the same...

export interface UpdateInfo {
  version: string;
  releaseDate: string;
  changelog: string[];
  breaking: boolean;
  downloadUrl?: string;
  size?: string;
}

export interface DatabaseConfig {
  enabled: boolean;
  settings: {
    url: string;
    allowRoot: boolean;
    maxExecutionTime: number;
    uploadLimit: string;
    memoryLimit: string;
    theme: 'original' | 'pmahomme' | 'metro';
    defaultLanguage: string;
    showServerInfo: boolean;
    showPhpInfo: boolean;
    showGitRevision: boolean;
  };
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  version: string;
  status: {
    installed: boolean;
    running: boolean;
    error?: string;
    lastChecked?: string;
  };
  requiredPorts: number[];
  requiredMemory: number;
  requiredDisk: number;
}

// Rest of the interfaces remain the same...