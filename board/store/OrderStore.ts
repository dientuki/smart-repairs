import { create } from 'zustand'
import { createOrder, getOrder, getOrderCreationData, uploadAttachment } from "@/lib/orders";
import { addComment, updateCommentVisibility, updateComment, deleteComment } from "@/lib/comments";
import { createCustomer, updateCustomer } from "@/lib/customers";
import { createDevice, updateDevice } from "@/lib/devices";
import { createDeviceUnit, updateDeviceUnit, setCustomerDeviceUnit } from "@/lib/deviceUnits";
import { getDeviceVersions } from "@/lib/deviceVersions";

interface OrderStore {
    order: Order,
    getOrder: (id: string) => Promise<void>,

    updateCommentVisibility: (commentId: string, isPublic: boolean) => void
    updateComment: (commentId: string, text: string) => void,
    deleteComment: (commentId: string) => void,
    addComment: (newComment:NewOrderComment) => Promise<OrderComment>

    data: any,
    getOrderCreationData: () => Promise<void>

    addCustomer: (customer: Customer) => Promise<string>
    updateCustomer: (customer: Customer) => Promise<boolean>

    setCustomerDeviceUnit: (customerDevice: CustomerDeviceUnit) => Promise<any>

    addDevice: (device: NewDevice) => Promise<string>
    updateDevice: (device: NewDevice) => Promise<boolean>

    addDeviceUnit: (deviceUnit: NewDeviceUnit) => Promise<string>
    updateDeviceUnit: (deviceUnit: NewDeviceUnit) => Promise<boolean>

    getDeviceVersions: (device: String) => Promise<DeviceVersion[]>

    addOrder: (newOrder: NewOrder) => Promise<void>,
    uploadAttachment: (orderId:string, attachment: File) => Promise<void>,
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
  getOrderCreationData: async () => {
    const data = await getOrderCreationData();
    set({ data });
  },
  addCustomer: async (customer: Customer): Promise<string> => {
    return await createCustomer(customer);
  },

  updateCustomer: async (customer: Customer): Promise<boolean> => {
    return await updateCustomer(customer);
  },

  setCustomerDeviceUnit: async (customerDevice: CustomerDeviceUnit): Promise<any> => {
    return await setCustomerDeviceUnit(customerDevice);
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

  getDeviceVersions: async (device: String): Promise<DeviceVersion[]> => {
    return await getDeviceVersions(device);
  },

  addOrder: async (newOrder: NewOrder): Promise<void> => {
    return await createOrder(newOrder);
  },

  uploadAttachment: async (orderId: string, attachment: File): Promise<void> => {
    return await uploadAttachment(orderId, attachment);
  }
}));