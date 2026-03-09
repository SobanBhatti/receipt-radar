import { create } from 'zustand';
import { User } from '../types';

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
