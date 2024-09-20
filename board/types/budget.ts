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

interface InitialValues {
  discounts: OptionType[];
  services: OptionType[];
  parts: OptionType[];
  budget: Budget | null;
}
