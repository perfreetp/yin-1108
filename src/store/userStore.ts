import { create } from 'zustand';
import type { UserInfo, ItemLevel } from '@/types';
import { currentUser } from '@/data/knowledge';

interface UserState {
  user: UserInfo | null;
  loading: boolean;
  level: ItemLevel;
  setUser: (user: UserInfo | null) => void;
  setLevel: (level: ItemLevel) => void;
  fetchUser: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: currentUser,
  loading: false,
  level: 'provincial',

  setUser: (user) => set({ user }),
  setLevel: (level) => set({ level }),

  fetchUser: () => {
    set({ loading: true });
    setTimeout(() => {
      set({ user: currentUser, loading: false });
    }, 300);
  },

  hasPermission: (permission) => {
    const { user } = get();
    if (!user) return false;
    return user.permissions.includes(permission);
  },
}));
