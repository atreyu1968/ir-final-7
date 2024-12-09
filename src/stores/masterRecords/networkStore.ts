import { create } from 'zustand';
import type { Network } from '../../types/masterRecords';

interface NetworkState {
  networks: Network[];
  setNetworks: (networks: Network[]) => void;
  addNetwork: (network: Omit<Network, 'id'>) => void;
  updateNetwork: (id: string, network: Partial<Network>) => void;
  deleteNetwork: (id: string) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  networks: [],
  
  setNetworks: (networks) => set({ networks }),
  
  addNetwork: (networkData) => set((state) => ({
    networks: [...state.networks, { ...networkData, id: Date.now().toString() }],
  })),
  
  updateNetwork: (id, networkData) => set((state) => ({
    networks: state.networks.map((network) =>
      network.id === id ? { ...network, ...networkData } : network
    ),
  })),
  
  deleteNetwork: (id) => set((state) => ({
    networks: state.networks.filter((network) => network.id !== id),
  })),
}));