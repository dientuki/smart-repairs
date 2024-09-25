import { create } from "zustand";
import { useServiceJobStore, useUserStore } from "@/store";
import { getInitialValues, updateBudget } from "@/services/budget";
import { clearState } from "@/helper/storeHelpers";
import { getCurrency, getType, isQuantityDisabled } from "@/helper/budgetHelpers";

interface BudgetStore {
  parts: OptionType[];
  budget: any;
  clear: (keys: string | string[]) => void;
  initialValues: (
    orderId?: string,
  ) => Promise<{ description: OptionType[]; budget: Budget | null }>;
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
  ): Promise<{ description: OptionType[]; budget: Budget | null }> => {
    const { user } = useUserStore.getState();

    const { discounts, services, parts, budget: dbBudget } = await getInitialValues(
      user.package,
      orderId,
    );
    const description:OptionType[] = [...services, ...discounts, ...parts];

    let viewBudget: ViewBudget | null = null;
    if (dbBudget) {
      const items = dbBudget.items.reduce((acc: ViewItem[], item: DBItem) => {
        const itemable = description.find(desc => desc.id === item.itemable_id);

        if (itemable) {
          acc.push({
            id: item.id,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            totalPrice: item.item_total,
            includeInSum: item.include_in_sum,
            qdisabled: isQuantityDisabled(itemable.info.item_type),
            type: getType(itemable.info.item_type),
            currency: getCurrency(itemable.info, user.currency),
            itemable: itemable, // Mapeamos el itemable
          });
        }

        return acc;
      }, []);

      viewBudget = {
        id: dbBudget.id,
        subtotal: dbBudget.subtotal,
        discount: dbBudget.discount,
        items: items, // Asignamos los items convertidos
      };
    }

    return {
      description: description,
      budget: viewBudget,
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
