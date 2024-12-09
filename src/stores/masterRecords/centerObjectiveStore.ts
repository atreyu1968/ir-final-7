import { create } from 'zustand';
import type { CenterObjective } from '../../types/masterRecords';

interface CenterObjectiveState {
  centerObjectives: CenterObjective[];
  setCenterObjectives: (objectives: CenterObjective[]) => void;
  addCenterObjective: (objective: Omit<CenterObjective, 'id'>) => void;
  updateCenterObjective: (id: string, objective: Partial<CenterObjective>) => void;
  deleteCenterObjective: (id: string) => void;
  toggleCenterObjectiveActive: (id: string) => void;
}

export const useCenterObjectiveStore = create<CenterObjectiveState>((set) => ({
  centerObjectives: [],
  
  setCenterObjectives: (centerObjectives) => set({ centerObjectives }),
  
  addCenterObjective: (objectiveData) => set((state) => ({
    centerObjectives: [...state.centerObjectives, { ...objectiveData, id: Date.now().toString() }],
  })),
  
  updateCenterObjective: (id, objectiveData) => set((state) => ({
    centerObjectives: state.centerObjectives.map((objective) =>
      objective.id === id ? { ...objective, ...objectiveData } : objective
    ),
  })),
  
  deleteCenterObjective: (id) => set((state) => ({
    centerObjectives: state.centerObjectives.filter((objective) => objective.id !== id),
  })),
  
  toggleCenterObjectiveActive: (id) => set((state) => ({
    centerObjectives: state.centerObjectives.map((objective) =>
      objective.id === id ? { ...objective, isActive: !objective.isActive } : objective
    ),
  })),
}));