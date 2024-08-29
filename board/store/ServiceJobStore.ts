import { create } from 'zustand'
import { getDiscounts, getServices } from '@/services/serviceJobs'; // Asegúrate de que la ruta sea correcta

interface ServiceJobStore {
  discounts: OptionType[];
  services: OptionType[];
  getDiscounts: () => Promise<void>;
  getServices: () => Promise<void>;
  setDiscounts: (discounts: OptionType[]) => void;
  setServices: (services: OptionType[]) => void;
}

export const useServiceJobStore = create<ServiceJobStore>((set) => ({
    discounts: [],
    services: [],

    setDiscounts: (discounts: OptionType[]) => set({ discounts }),
    setServices: (services: OptionType[]) => set({ services }),

    getDiscounts: async () => {
        const discount = await getDiscounts();
        set({ discounts: discount });
    },
    getServices: async () => {
        const service = await getServices();
        set({ services: service });
    }
}));
