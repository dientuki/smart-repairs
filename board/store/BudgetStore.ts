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
      budget: budget.length ? budget[0] : null,
    };
  },

  updateBudget: async (budgetResume: any, budgetItems: any): Promise<boolean> => {
    const normalizedItems = budgetItems.items.reduce((acc, item) => {
      acc.push({
        id: item.id,
        itemableId: item.itemable.id,
        itemableType: item.itemable.info.item_type,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        includeInSum: item.includeInSum,
      });
      return acc;
    }, []);

    const $status = await updateBudget(budgetResume, normalizedItems);
    return $status;
  },
}));
