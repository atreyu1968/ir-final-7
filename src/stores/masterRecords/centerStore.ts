import { create } from 'zustand';
import type { Center } from '../../types/masterRecords';

interface CenterState {
  centers: Center[];
  setCenters: (centers: Center[]) => void;
  addCenter: (center: Omit<Center, 'id'>) => void;
  updateCenter: (id: string, center: Partial<Center>) => void;
  deleteCenter: (id: string) => void;
}

export const useCenterStore = create<CenterState>((set) => ({
  centers: [],
  
  setCenters: (centers) => set({ centers }),
  
  addCenter: (centerData) => set((state) => ({
    centers: [...state.centers, { ...centerData, id: Date.now().toString() }],
  })),
  
  updateCenter: (id, centerData) => set((state) => ({
    centers: state.centers.map((center) =>
      center.id === id ? { ...center, ...centerData } : center
    ),
  })),
  
  deleteCenter: (id) => set((state) => ({
    centers: state.centers.filter((center) => center.id !== id),
  })),
}));