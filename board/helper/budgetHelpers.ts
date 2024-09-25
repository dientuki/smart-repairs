// helpers/budgetHelpers.ts
import { Itemable, DiscountType } from '@/types/enums'; // Asegúrate de importar tus tipos correctamente

interface ItemInfo {
    item_type: Itemable[];
    type: DiscountType[];
}

export const getCurrency = (info: ItemInfo, defaultValue: string): string => {
    if (info.item_type.includes(Itemable.Discount)) {
        if (info.type.includes(DiscountType.Percentage)) {
            return "%";
        }
    }
    return defaultValue; // Retorna el valor por defecto si no se cumple ninguna condición
};

export const isQuantityDisabled = (itemType: Itemable[]): boolean => {
  return itemType.indexOf(Itemable.Part) === -1;
};

export const getQuantity = (itemType: Itemable[], fallbackValue: number): number => {
  return itemType.indexOf(Itemable.Part) === -1 ? 1 : fallbackValue;
};

export const getType = (str: string): string => {
  const tmp = str.split("\\");
  return `budget.type.${tmp[tmp.length - 1].toLowerCase()}`;
};