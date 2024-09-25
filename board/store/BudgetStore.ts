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
    const description = [...services, ...discounts, ...parts];

    if (budget) {
      budget.items = budget.items.reduce((acc, item) => {
        // Aquí defines la lógica para transformar los elementos
        const itemable = description.find(desc => desc.id === item.itemable_id);

        acc.push({
            id: item.id,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            totalPrice: item.item_total,
            includeInSum: item.include_in_sum,
            qdisabled: true,
            type: 'Part',
            currency: user?.currency,
            itemable: itemable
        });
        return acc;
      }, []);
    }

    return {
      description: [...services, ...discounts, ...parts],
      budget: budget,
    };
  },

  updateBudget: async (orderId: string, budgetItems: any): Promise<boolean> => {
    const normalizedItems = budgetItems.items.reduce((acc, item) => {
      acc.push({
        id: item.id,
        itemableId: item.itemable.id,
        itemableType: item.itemable.info.item_type,
        quantity: parseInt(item.quantity, 10),
        unitPrice: parseFloat(item.unitPrice),
        includeInSum: item.includeInSum,
      });
      return acc;
    }, []);

    const $status = await updateBudget(orderId, normalizedItems);
    return $status;
  },
}));
