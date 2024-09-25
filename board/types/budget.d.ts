import { BudgetColumns } from "@/types/enums";

declare global {
  interface BudgetItem {
    part_id?: string;
    service_job_id?: string;
    quantity: number;
    unit_price: number;
    include_in_sum: boolean;
  }

  interface Budget {
    id: string;
    total: number;
    items: BudgetItem[];
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