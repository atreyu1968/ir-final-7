import { create } from 'zustand';
import type { NetworkObjective } from '../../types/masterRecords';

interface ODSState {
  ods: NetworkObjective[];
  setODS: (ods: NetworkObjective[]) => void;
  toggleODSActive: (id: string) => void;
}

export const useODSStore = create<ODSState>((set) => ({
  ods: [],
  
  setODS: (ods) => set({ ods }),
  
  toggleODSActive: (id) => set((state) => ({
    ods: state.ods.map((objective) =>
      objective.id === id ? { ...objective, isActive: !objective.isActive } : objective
    ),
  })),
}));