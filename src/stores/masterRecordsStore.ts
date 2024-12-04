import { create } from 'zustand';
import type { Network, Center, ProfessionalFamily, Department, NetworkObjective, CenterObjective } from '../types/masterRecords';
import { mockNetworks, mockCenters, mockFamilies, mockDepartments, mockObjectives } from '../data/mockMasterRecords';
import { mockODS } from '../data/mockODS';
import { mockCenterObjectives } from '../data/mockCenterObjectives';

interface MasterRecordsState {
  networks: Network[];
  centers: Center[];
  families: ProfessionalFamily[];
  departments: Department[];
  objectives: NetworkObjective[];
  centerObjectives: CenterObjective[];
  ods: NetworkObjective[];
  
  initializeStore: () => void;
  setNetworks: (networks: Network[]) => void;
  setCenters: (centers: Center[]) => void;
  setFamilies: (families: ProfessionalFamily[]) => void;
  setDepartments: (departments: Department[]) => void;
  setObjectives: (objectives: NetworkObjective[]) => void;
  setCenterObjectives: (objectives: CenterObjective[]) => void;
  setODS: (ods: NetworkObjective[]) => void;
  
  addNetwork: (network: Omit<Network, 'id'>) => void;
  updateNetwork: (id: string, network: Partial<Network>) => void;
  deleteNetwork: (id: string) => void;
  
  addCenter: (center: Omit<Center, 'id'>) => void;
  updateCenter: (id: string, center: Partial<Center>) => void;
  deleteCenter: (id: string) => void;
  
  addFamily: (family: Omit<ProfessionalFamily, 'id'>) => void;
  updateFamily: (id: string, family: Partial<ProfessionalFamily>) => void;
  deleteFamily: (id: string) => void;
  
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  
  addObjective: (objective: Omit<NetworkObjective, 'id'>) => void;
  updateObjective: (id: string, objective: Partial<NetworkObjective>) => void;
  deleteObjective: (id: string) => void;
  toggleObjectiveActive: (id: string) => void;
  
  addCenterObjective: (objective: Omit<CenterObjective, 'id'>) => void;
  updateCenterObjective: (id: string, objective: Partial<CenterObjective>) => void;
  deleteCenterObjective: (id: string) => void;
  toggleCenterObjectiveActive: (id: string) => void;
  
  toggleODSActive: (id: string) => void;
}

export const useMasterRecordsStore = create<MasterRecordsState>((set, get) => ({
  networks: [],
  centers: [],
  families: [],
  departments: [],
  objectives: [],
  centerObjectives: [],
  ods: [],
  
  initializeStore: () => {
    set({
      networks: mockNetworks,
      centers: mockCenters,
      families: mockFamilies,
      departments: mockDepartments,
      objectives: mockObjectives,
      centerObjectives: mockCenterObjectives,
      ods: mockODS,
    });
  },

  setNetworks: (networks) => set({ networks }),
  setCenters: (centers) => set({ centers }),
  setFamilies: (families) => set({ families }),
  setDepartments: (departments) => set({ departments }),
  setObjectives: (objectives) => set({ objectives }),
  setCenterObjectives: (objectives) => set({ centerObjectives }),
  setODS: (ods) => set({ ods }),
  
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
  
  addDepartment: (departmentData) => set((state) => ({
    departments: [...state.departments, { ...departmentData, id: Date.now().toString() }],
  })),
  
  updateDepartment: (id, departmentData) => set((state) => ({
    departments: state.departments.map((department) =>
      department.id === id ? { ...department, ...departmentData } : department
    ),
  })),
  
  deleteDepartment: (id) => set((state) => ({
    departments: state.departments.filter((department) => department.id !== id),
  })),
  
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
  
  toggleODSActive: (id) => set((state) => ({
    ods: state.ods.map((objective) =>
      objective.id === id ? { ...objective, isActive: !objective.isActive } : objective
    ),
  })),
}));