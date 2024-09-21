export enum BudgetColumns {
  Itemable = "itemable",
  Quantity = "quantity",
  UnitPrice = "unitPrice",
  TotalPrice = "totalPrice",
  IncludeInSum = "includeInSum",
}

export enum Itemable {
  Part = "Part",
  ServiceJob = "ServiceJob",
  Discount = "Discount",
}

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
