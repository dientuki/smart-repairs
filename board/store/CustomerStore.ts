import { create } from "zustand";
import { getCustomers, upsertCustomer } from "@/services/customers";
import { OperationStatus } from "@/types/enums";

interface UpsertCustomerResponse {
  customer: OptionType;
  operation: OperationStatus;
}

interface CustomerStore {
  customers: OptionType[];
  setCustomers: (customers: OptionType[]) => void;
  upsertCustomer: (customer: CustomerInput) => Promise<UpsertCustomerResponse>;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],

  setCustomers: (customers: OptionType[]) => {
    set({ customers });
  },

  getCustomers: async (): Promise<void> => {
    const customers: OptionType[] = await getCustomers();
    set({ customers });
  },

  upsertCustomer: async (
    customer: CustomerInput,
  ): Promise<UpsertCustomerResponse> => {
    const data = await upsertCustomer(customer);

    return {
      operation: data.operation as OperationStatus,
      customer: {
        id: data.customer.id,
        label: data.customer.label,
        info: {
          firstname: data.customer.first_name,
          lastname: data.customer.last_name,
          phone: data.customer.phone,
          email: data.customer.email,
        },
      },
    };
  },
}));
