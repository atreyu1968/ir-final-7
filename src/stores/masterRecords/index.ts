import { create } from 'zustand';
import { useNetworkStore } from './networkStore';
import { useCenterStore } from './centerStore';
import { useFamilyStore } from './familyStore';
import { useDepartmentStore } from './departmentStore';
import { useObjectiveStore } from './objectiveStore';
import { useCenterObjectiveStore } from './centerObjectiveStore';
import { useODSStore } from './odsStore';
import { mockNetworks, mockCenters, mockFamilies, mockDepartments, mockObjectives } from '../../data/mockMasterRecords';
import { mockODS } from '../../data/mockODS';
import { mockCenterObjectives } from '../../data/mockCenterObjectives';

interface MasterRecordsState {
  initializeStore: () => void;
}

export const useMasterRecordsStore = create<MasterRecordsState>(() => ({
  initializeStore: () => {
    const { setNetworks } = useNetworkStore.getState();
    const { setCenters } = useCenterStore.getState();
    const { setFamilies } = useFamilyStore.getState();
    const { setDepartments } = useDepartmentStore.getState();
    const { setObjectives } = useObjectiveStore.getState();
    const { setCenterObjectives } = useCenterObjectiveStore.getState();
    const { setODS } = useODSStore.getState();

    // Initialize all stores with mock data
    setNetworks(mockNetworks);
    setCenters(mockCenters);
    setFamilies(mockFamilies);
    setDepartments(mockDepartments);
    setObjectives(mockObjectives);
    setCenterObjectives(mockCenterObjectives);
    setODS(mockODS);
  },
}));

// Re-export individual stores
export { useNetworkStore } from './networkStore';
export { useCenterStore } from './centerStore';
export { useFamilyStore } from './familyStore';
export { useDepartmentStore } from './departmentStore';
export { useObjectiveStore } from './objectiveStore';
export { useCenterObjectiveStore } from './centerObjectiveStore';
export { useODSStore } from './odsStore';