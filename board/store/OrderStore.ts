import { getOrder } from "@/lib/getOrder";
import { create } from 'zustand'

interface OrderStore {
    order: Order,
    getOrder: (id: string) => void,
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: {} as Order,
  getOrder: async(id: string) => {
    const order = await getOrder(id);
    set({ order });
  },
}));