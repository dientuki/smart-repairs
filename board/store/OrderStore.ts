import { create } from 'zustand'
import { getOrder, getOrderCreationData } from "@/lib/orders";
import { addComment, updateCommentVisibility, updateComment, deleteComment } from "@/lib/comments";
import { createCustomer, updateCustomer } from "@/lib/customers";
import { createDevice, getDevicesByTypeAndBrand, updateDevice } from "@/lib/devices";
import { createDeviceUnit, updateDeviceUnit, setCustomerDeviceUnit, getTemporaryDeviceUnit, getDevicesUnitsByVersionId } from "@/lib/deviceUnits";
import { createOrder } from "@/lib/orders";
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

    getDeviceVersions: (device: string) => Promise<OptionType[]>

    addOrder: (newOrder: NewOrder) => Promise<void>,

    deviceUnitValidate: any,
    getDeviceUnitValidate: (orderId: string) => Promise<any>,

    getDevicesByTypeAndBrand: (type: string, brand: string) => Promise<OptionType[]>
    getDevicesUnitsByVersionId: (versionId: string) => Promise<OptionType[]>
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

  getDeviceVersions: async (device: String): Promise<OptionType[]> => {
    return await getDeviceVersions(device);
  },

  addOrder: async (newOrder: NewOrder): Promise<void> => {
    return await createOrder(newOrder);
  },

  deviceUnitValidate: false as any,
  getDeviceUnitValidate: async (orderId: String): Promise<any> => {
    return await getTemporaryDeviceUnit(orderId);
  },

  getDevicesByTypeAndBrand: async (type: String, brand: String): Promise<OptionType[]> => {
    return await getDevicesByTypeAndBrand(type, brand);
  },

  getDevicesUnitsByVersionId: async (versionId: String): Promise<OptionType[]> => {
    return await getDevicesUnitsByVersionId(versionId);
  }
}));