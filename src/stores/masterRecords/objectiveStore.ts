import { create } from 'zustand';
import type { NetworkObjective } from '../../types/masterRecords';

interface ObjectiveState {
  objectives: NetworkObjective[];
  setObjectives: (objectives: NetworkObjective[]) => void;
  addObjective: (objective: Omit<NetworkObjective, 'id'>) => void;
  updateObjective: (id: string, objective: Partial<NetworkObjective>) => void;
  deleteObjective: (id: string) => void;
  toggleObjectiveActive: (id: string) => void;
}

export const useObjectiveStore = create<ObjectiveState>((set) => ({
  objectives: [],
  
  setObjectives: (objectives) => set({ objectives }),
  
  addObjective: (objectiveData) => set((state) => ({
    objectives: [...state.objectives, { ...objectiveData, id: Date.now().toString() }],
  })),
  
  updateObjective: (id, objectiveData) => set((state) => ({
    objectives: state.objectives.map((objective) =>
      objective.id === id ? { ...objective, ...objectiveData } : objective
    ),
  })),
  
  deleteObjective: (id) => set((state) => ({
    objectives: state.objectives.filter((objective) => objective.id !== id),
  })),
  
  toggleObjectiveActive: (id) => set((state) => ({
    objectives: state.objectives.map((objective) =>
      objective.id === id ? { ...objective, isActive: !objective.isActive } : objective
    ),
  })),
}));