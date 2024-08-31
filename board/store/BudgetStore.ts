import { create } from 'zustand'
import { useServiceJobStore } from "@/store";
import { getInitialValues, updateBudget } from "@/services/budget";

interface BudgetStore {
  parts: OptionType[];
  budget: any;
  initialValues: (orderId: string) => Promise<void>;
  updateBudget: (orderId: string, data: any) => Promise<boolean>;
}

export const useBudgetStore = create<BudgetStore>((set) => ({
  parts: [],
  budget: {},

  initialValues: async(orderId: string) => {
    //get discounts, services, parts; and set vars in store
    const {discounts, services, parts} = await getInitialValues(orderId);

    useServiceJobStore.getState().setDiscounts(discounts);
    useServiceJobStore.getState().setServices(services);
    set({parts});
    /*

    if (budget) {
      set({budget});
    };
    */
  },

  updateBudget: async(orderId: string, data: any): Promise<boolean> => {
    const filteredData = data.filter((item: { serviceId: string }) => item.serviceId !== '').map(({  totalPrice, ...rest }) => rest);

    const $status = await updateBudget(orderId, filteredData);
    return $status;
  },

}));
