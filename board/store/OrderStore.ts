import { create } from 'zustand'
import { getOrder } from "@/lib/getOrder";
import { getCustomersDevices } from "@/lib/createOrder";
import { addComment, updateCommentVisibility, updateComment, deleteComment } from "@/lib/comments";
import { createCustomer, updateCustomer } from "@/lib/customers";
import { createDevice, updateDevice } from "@/lib/devices";
import { createDeviceUnit, updateDeviceUnit } from "@/lib/deviceUnits";
import { createOrder } from "@/lib/order";

interface OrderStore {
    order: Order,
    getOrder: (id: string) => void,

    updateCommentVisibility: (commentId: string, isPublic: boolean) => void
    updateComment: (commentId: string, text: string) => void,
    deleteComment: (commentId: string) => void,
    addComment: (newComment:NewOrderComment) => Promise<OrderComment>

    data: any,
    getData: () => Promise<any>

    addCustomer: (customer: Customer) => Promise<string>
    updateCustomer: (customer: Customer) => Promise<boolean>

    addDevice: (device: NewDevice) => Promise<string>
    updateDevice: (device: NewDevice) => Promise<boolean>

    addDeviceUnit: (deviceUnit: NewDeviceUnit) => Promise<string>
    updateDeviceUnit: (deviceUnit: NewDeviceUnit) => Promise<boolean>

    addOrder: (newOrder: NewOrder) => Promise<void>
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: {} as Order,
  getOrder: async(id: string) => {
    const order = await getOrder(id);
    set({ order });
  },

  updateCommentVisibility: (commentId: string, isPublic: boolean) => {
    updateCommentVisibility(commentId, isPublic);
  },

  updateComment: (commentId: string, text: string) => {
    updateComment(commentId, text);
  },

  deleteComment: async (commentId: string) => {
    await deleteComment(commentId);
  },

  addComment: async (newComment:NewOrderComment) => {
    return await addComment(newComment);
  },

  data: {} as any,
  getData: async () => {
    const data = await getCustomersDevices();
    set({ data });
  },
  addCustomer: async (customer: Customer): Promise<string> => {
    return await createCustomer(customer);
  },

  updateCustomer: async (customer: Customer): Promise<boolean> => {
    return await updateCustomer(customer);
  },

  addDevice: async (device: NewDevice): Promise<string> => {
    return await createDevice(device);
  },

  updateDevice: async (device: NewDevice): Promise<boolean> => {
    return await updateDevice(device);
  },

  addDeviceUnit: async (deviceUnit: NewDeviceUnit): Promise<string> => {
    return await createDeviceUnit(deviceUnit);
  },

  updateDeviceUnit: async (deviceUnit: NewDeviceUnit): Promise<boolean> => {
    return await updateDeviceUnit(deviceUnit);
  },

  addOrder: async (newOrder: NewOrder): Promise<void> => {
    await createOrder(newOrder);
  },
}));