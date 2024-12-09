import { create } from 'zustand';
import type { Department } from '../../types/masterRecords';

interface DepartmentState {
  departments: Department[];
  setDepartments: (departments: Department[]) => void;
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
}

export const useDepartmentStore = create<DepartmentState>((set) => ({
  departments: [],
  
  setDepartments: (departments) => set({ departments }),
  
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
}));