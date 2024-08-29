import { create } from 'zustand'
import { useServiceJobStore } from "@/store";
import { getInitialValues } from "@/services/budget";

interface BudgetStore {
  parts: OptionType[];
  budget: any;
  initialValues: () => Promise<void>;
}

export const useBudgetStore = create<BudgetStore>((set) => ({
    parts: [],
    budget: {},

    initialValues: async() => {
      //get discounts, services, parts; and set vars in store
      const {discounts, services, parts} = await getInitialValues('01J6FDPPA4CGWQ2A8RWRJNH53G');
      //const parts = 'parts';

      useServiceJobStore.getState().setDiscounts(discounts);
      useServiceJobStore.getState().setServices(services);
      set({parts});
      /*

      if (budget) {
        set({budget});
      };
      */
    }

}));
