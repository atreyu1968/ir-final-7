import { create } from 'zustand';
import type { User } from '../types/user';
import { mockUsers } from '../data/mockUsers';

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUserPassword: (newPassword: string) => Promise<void>;
  resetUserPassword: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  users: mockUsers,
  isAuthenticated: false,

  login: (user) => set({ 
    user, 
    isAuthenticated: true 
  }),

  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),

  updateUserPassword: async (newPassword: string) => {
    const { user, users } = get();
    if (!user) return;

    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));

    set({
      users: users.map(u => 
        u.id === user.id 
          ? { ...u, passwordChangeRequired: false }
          : u
      ),
      user: { ...user, passwordChangeRequired: false }
    });
  },

  resetUserPassword: async (userId: string) => {
    const { users } = get();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));

    set({
      users: users.map(u => 
        u.id === userId 
          ? { ...u, passwordChangeRequired: true }
          : u
      )
    });
  }
}));