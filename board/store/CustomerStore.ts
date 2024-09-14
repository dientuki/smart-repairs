import { create } from "zustand";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
} from "@/services/customers";
import { extra } from "@/helper/reduceHelpers";
import { OperationStatus } from "@/types/enums";
import { useOrderStore } from "./OrderStore";

interface CustomerStore {
  customers: OptionType[];
  setCustomers: (customers: OptionType[]) => void;
  updateOrCreateCustomer: (customer: CustomerInput) => Promise<OperationStatus>;
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

  updateOrCreateCustomer: async (
    customer: CustomerInput,
  ): Promise<OperationStatus> => {
    const setCreateOrderSelectedData =
      useOrderStore.getState().setCreateOrderSelectedData;

    if (!customer.id) {
      const addedCustomer = await createCustomer(customer);
      customer.id = addedCustomer;
      customer.label = `${customer.firstname} ${customer.lastname}`;
      set((state) => ({
        customers: [...state.customers, extra([customer])[0]],
      }));

      setCreateOrderSelectedData({ customer: extra([customer])[0] });
      return OperationStatus.CREATED;
    } else {
      const updatedCustomer = await updateCustomer(customer);
      customer.label = `${customer.firstname} ${customer.lastname}`;
      if (updatedCustomer) {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === updatedCustomer.id ? extra([customer])[0] : c,
          ),
        }));
        setCreateOrderSelectedData({ customer: extra([customer])[0] });
        return OperationStatus.UPDATED;
      }
      return OperationStatus.NO_CHANGE;
    }
  },
}));
