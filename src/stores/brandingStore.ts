import { create } from 'zustand';
import { DEFAULT_LOGO_URL, DEFAULT_FAVICON_URL } from '../config/constants';
import type { BrandingConfig } from '../types/admin';

interface BrandingState {
  config: BrandingConfig;
  updateConfig: (config: BrandingConfig) => void;
}

export const useBrandingStore = create<BrandingState>((set) => ({
  config: {
    logoUrl: DEFAULT_LOGO_URL,
    faviconUrl: DEFAULT_FAVICON_URL,
    font: 'inter',
    colors: {
      primary: '#2563eb',
      secondary: '#4b5563',
      accent: '#8b5cf6',
    },
  },
  
  updateConfig: (config) => {
    set({ config });
    
    // Update favicon
    if (config.faviconUrl) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = config.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    // Store in localStorage
    localStorage.setItem('brandingConfig', JSON.stringify(config));
  },
}));