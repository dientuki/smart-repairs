import { create } from "zustand";
import { getDiscounts, getServices } from "@/services/serviceJobs"; // Asegúrate de que la ruta sea correcta
import { clearState } from "@/helper/storeHelpers";

interface ServiceJobStore {
  discounts: OptionType[];
  services: OptionType[];
  clear: (keys: string | string[]) => void;
  getDiscounts: () => Promise<void>;
  getServices: () => Promise<void>;
  setDiscounts: (discounts: OptionType[]) => void;
  setServices: (services: OptionType[]) => void;
}

const defaultState = {
  discounts: [] as OptionType[],
  services: [] as OptionType[],
};

export const useServiceJobStore = create<ServiceJobStore>((set) => ({
  discounts: defaultState.discounts,
  services: defaultState.services,

  clear: (keys: string | string[]) => clearState(keys, defaultState, set),

  setDiscounts: (discounts: OptionType[]) => set({ discounts }),
  setServices: (services: OptionType[]) => set({ services }),

  getDiscounts: async () => {
    const discount = await getDiscounts();
    set({ discounts: discount });
  },
  getServices: async () => {
    const service = await getServices();
    set({ services: service });
  },
}));
