import { create } from 'zustand'
import { getOrder } from "@/lib/getOrder";
import { getCustomersDevices } from "@/lib/createOrder";
import { addComment, updateCommentVisibility, updateComment, deleteComment } from "@/lib/comments";
import { createCustomer, updateCustomer } from "@/lib/customers";
import { createDevice, updateDevice } from "@/lib/devices";
import { createDeviceUnit, updateDeviceUnit } from "@/lib/deviceUnits";

interface OrderStore {
    order: Order,
    getOrder: (id: string) => void,

    updateCommentVisibility: (commentId: string, isPublic: boolean) => void
    updateComment: (commentId: string, text: string) => void,
    deleteComment: (commentId: string) => void,
    addComment: (newComment:NewOrderComment) => Promise<OrderComment>

    data: any,
    getData: (tenantId:string) => Promise<any>

    addCustomer: (customer: Customer) => Promise<string>
    updateCustomer: (customer: Customer) => Promise<void>

    addDevice: (device: NewDevice) => Promise<string>
    updateDevice: (device: NewDevice) => Promise<void>

    addDeviceUnit: (deviceUnit: DeviceUnit) => Promise<string>
    updateDeviceUnit: (deviceUnit: DeviceUnit) => Promise<void>

    // addOrder: (newOrder: NewOrder) => void
    // updateOrder: (order: Order) => void
    // deleteOrder: (orderId: string) => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: {} as Order,
  getOrder: async(id: string) => {
    const order = await getOrder(id);
    set({ order });
  },

  updateCommentVisibility: async (commentId: string, isPublic: boolean) => {
    await updateCommentVisibility(commentId, isPublic);
  },

  updateComment: async (commentId: string, text: string) => {
    await updateComment(commentId, text);
  },

  deleteComment: async (commentId: string) => {
    await deleteComment(commentId);
  },

  addComment: async (newComment:NewOrderComment) => {
    return await addComment(newComment);
  },

  data: {} as any,
  getData: async (tenantId:string) => {
    const data = await getCustomersDevices(tenantId);
    set({ data });
  },
  addCustomer: async (customer: Customer): Promise<string> => {
    return await createCustomer(customer);
  },

  updateCustomer: async (customer: Customer): Promise<void> => {
    await updateCustomer(customer);
  },

  addDevice: async (device: NewDevice): Promise<string> => {
    return await createDevice(device);
  },

  updateDevice: async (device: NewDevice): Promise<void> => {
    await updateDevice(device);
  },

  addDeviceUnit: async (deviceUnit: DeviceUnit): Promise<string> => {
    return await createDeviceUnit(deviceUnit);
  },

  updateDeviceUnit: async (deviceUnit: DeviceUnit): Promise<void> => {
    await updateDeviceUnit(deviceUnit);
  },

}));