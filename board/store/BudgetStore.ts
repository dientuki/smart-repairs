import { create } from "zustand";
import { useUserStore } from "@/store";
import { getInitialValues, updateBudget } from "@/services/budget";
import {
  getCurrency,
  getType,
  isQuantityDisabled,
} from "@/helper/budgetHelpers";
import { FieldValues } from "react-hook-form";

interface BudgetStore {
  initialValues: (
    orderId?: string,
  ) => Promise<{ description: OptionType[]; budget: ViewBudget | undefined }>;
  updateBudget: (orderId: string, data: FieldValues) => Promise<boolean>;
}

export const useBudgetStore = create<BudgetStore>(() => ({
  initialValues: async (
    orderId?: string,
  ): Promise<{ description: OptionType[]; budget: ViewBudget | undefined }> => {
    const { user } = useUserStore.getState();

    const {
      discounts,
      services,
      parts,
      budget: dbBudget,
    } = await getInitialValues(user.package, orderId);
    const description: OptionType[] = [...services, ...discounts, ...parts];

    let viewBudget: ViewBudget | undefined = undefined;
    if (dbBudget) {
      const items: ViewItem[] = dbBudget.items.reduce(
        (acc: ViewItem[], item: DBItem) => {
          const itemable: OptionType | undefined = description.find(
            (desc) => desc.id === item.itemable_id,
          );

          if (itemable && itemable.info) {
            acc.push({
              id: item.id,
              quantity: item.quantity,
              unitPrice: item.unit_price,
              totalPrice: item.item_total,
              includeInSum: item.include_in_sum,
              qdisabled: isQuantityDisabled(itemable.info.item_type),
              type: getType(itemable.info.item_type),
              currency: getCurrency(itemable.info, user.currency),
              itemable: itemable as OptionType,
            });
          }

          return acc;
        },
        [],
      );

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

  updateBudget: async (
    orderId: string,
    data: FieldValues,
  ): Promise<boolean> => {
    const normalizedItems: ItemToDB[] = data.items.reduce(
      (acc: ItemToDB[], item: ViewItem) => {
        acc.push({
          id: item.id,
          itemableId: item.itemable.id,
          itemableType: item.itemable.info.item_type,
          quantity:
            typeof item.quantity === "number"
              ? item.quantity
              : parseInt(item.quantity, 10),
          unitPrice:
            typeof item.unitPrice === "number"
              ? item.unitPrice
              : parseFloat(item.unitPrice),
          includeInSum: item.includeInSum,
        });
        return acc;
      },
      [],
    );

    const $status = await updateBudget(orderId, normalizedItems);
    return $status;
  },
}));
