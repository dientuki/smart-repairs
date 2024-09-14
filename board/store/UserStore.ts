import { getCurrentUser } from "@/services/user";
import { create } from 'zustand'

interface UserStore {
    user: User | null,
    getCurrentUser: () => Promise<void>,
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  getCurrentUser: async() => {
    const user = await getCurrentUser();
    set({ user });
  }
}));