import { getCurrentUser } from "@/services/user";
import { create } from "zustand";

interface UserStore {
  user: User;
  getCurrentUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    id: "",
    name: "",
    imageUrl: "",
    package: "",
    currency: "$",
  },

  getCurrentUser: async () => {
    const user = await getCurrentUser();
    set({ user });
  },
}));
