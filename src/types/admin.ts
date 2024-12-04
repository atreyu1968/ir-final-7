// ... (previous interfaces remain the same)

export interface DocsConfig {
  settings: {
    url: string;
    title: string;
    description: string;
    theme?: {
      primaryColor?: string;
      accentColor?: string;
    };
  };
  enabled: boolean;
}