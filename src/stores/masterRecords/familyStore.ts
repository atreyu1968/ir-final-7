import { create } from 'zustand';
import type { ProfessionalFamily } from '../../types/masterRecords';

interface FamilyState {
  families: ProfessionalFamily[];
  setFamilies: (families: ProfessionalFamily[]) => void;
  addFamily: (family: Omit<ProfessionalFamily, 'id'>) => void;
  updateFamily: (id: string, family: Partial<ProfessionalFamily>) => void;
  deleteFamily: (id: string) => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  families: [],
  
  setFamilies: (families) => set({ families }),
  
  addFamily: (familyData) => set((state) => ({
    families: [...state.families, { ...familyData, id: Date.now().toString() }],
  })),
  
  updateFamily: (id, familyData) => set((state) => ({
    families: state.families.map((family) =>
      family.id === id ? { ...family, ...familyData } : family
    ),
  })),
  
  deleteFamily: (id) => set((state) => ({
    families: state.families.filter((family) => family.id !== id),
  })),
}));