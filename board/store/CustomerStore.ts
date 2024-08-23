import { create } from 'zustand'
import { createCustomer, updateCustomer } from "@/lib/customers";

interface CustomerStore {
    addCustomer: (customer: Customer) => Promise<string>
    updateCustomer: (customer: Customer) => Promise<boolean>
}

export const useCustomerStore = create<CustomerStore>(() => ({
  addCustomer: async (customer: Customer): Promise<string> => {
    return await createCustomer(customer);
  },

  updateCustomer: async (customer: Customer): Promise<boolean> => {
    return await updateCustomer(customer);
  }
}));