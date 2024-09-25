import { BudgetColumns } from "@/types/enums";

declare global {

  interface ItemBase {
    id: string;
    quantity: number;
  }

  interface DBItem extends ItemBase {
    itemable_id: string;
    itemable_type: string;
    unit_price: number;
    item_total: number;
    include_in_sum: boolean;
  }

  interface ViewItem extends ItemBase {
    itemable: OptionType[] | string;
    unitPrice: number;
    totalPrice: number;
    qdisabled: boolean;
    type: string;
    currency: string;
    includeInSum: boolean;
  }

  interface BudgetBase {
    id: string;
    subtotal: number;
    discount: number;
  }

  // DBBudget tiene un arreglo de DBItem
  interface DBBudget extends BudgetBase {
    items: DBItem[];
  }

  // ViewBudget tiene un arreglo de ViewItem
  interface ViewBudget extends BudgetBase {
    items: ViewItem[];
  }

  interface UpdateField {
    columnId: BudgetColumns; // El enum que contiene las columnas
    value: number; // El valor numérico que se debe actualizar
  }

  interface BudgetResumeData {
    subtotal: number;
    discount: number;
    total: number;
  }

  interface InitialValues {
    discounts: OptionType[];
    services: OptionType[];
    parts: OptionType[];
    budget: Budget | null;
  }
}

// Evita que el archivo se considere un módulo
export {};