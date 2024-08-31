import { create } from 'zustand'
import { useServiceJobStore } from "@/store";
import { getInitialValues, updateBudget } from "@/services/budget";
import { clearState } from "@/helper/storeHelpers";

interface BudgetStore {
  parts: OptionType[];
  budget: any;
  clear: (keys: string | string[]) => void;
  initialValues: (orderId: string) => Promise<void>;
  updateBudget: (orderId: string, data: any) => Promise<boolean>;
}

const defaultState = {
  parts: [] as OptionType[],
  budget: {} as any,
};

export const useBudgetStore = create<BudgetStore>((set) => ({
  parts: [],
  budget: {},

  clear: (keys: string | string[]) => clearState(keys, defaultState, set),

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
