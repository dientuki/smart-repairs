import { create } from "zustand";
import { useServiceJobStore, useUserStore } from "@/store";
import { getInitialValues, updateBudget } from "@/services/budget";
import { clearState } from "@/helper/storeHelpers";

interface BudgetStore {
  parts: OptionType[];
  budget: any;
  clear: (keys: string | string[]) => void;
  initialValues: (
    orderId?: string,
  ) => Promise<{ description: any[]; budget: any }>;
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

  initialValues: async (
    orderId?: string,
  ): Promise<{ description: any[]; budget: any }> => {
    const { user } = useUserStore.getState();

    const { discounts, services, parts, budget } = await getInitialValues(
      user.package,
      orderId,
    );

    return {
      description: [...services, ...discounts, ...parts],
      budget: budget,
    };
  },

  updateBudget: async (orderId: string, data: any): Promise<boolean> => {
    const filteredData = data
      .filter((item: { serviceId: string }) => item.serviceId !== "")
      .map(({ totalPrice, ...rest }) => rest);

    const $status = await updateBudget(orderId, filteredData);
    return $status;
  },
}));
