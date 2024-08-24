import { create } from 'zustand'
import { getOrder, getOrderCreationData } from "@/lib/orders";
import { addComment, updateCommentVisibility, updateComment, deleteComment } from "@/lib/comments";
import { createOrder } from "@/lib/orders";
import { useCustomerStore, useDeviceStore, useBrandStore, useDeviceTypeStore } from "@/store";

interface CreateOrderSelectedData {
  customer?: OptionType | null;
  deviceId?: string | null;
  deviceLabel?: string | null;
  deviceTypeId?: string | null;
  deviceTypeLabel?: string | null;
  temporaryDeviceUnitId?: string | null;
}
interface OrderStore {
    order: Order,
    tmpOrder: any,
    getOrder: (id: string) => Promise<void>,

    updateCommentVisibility: (commentId: string, isPublic: boolean) => void
    updateComment: (commentId: string, text: string) => void,
    deleteComment: (commentId: string) => void,
    addComment: (newComment:NewOrderComment) => Promise<OrderComment>

    initializeOrderCreationData: () => Promise<void>
    createOrderSelectedData: {
      customer: OptionType | null;
      deviceId: string | null;
      deviceLabel: string | null;
      deviceTypeId: string | null;
      deviceTypeLabel: string | null;
      temporaryDeviceUnitId: string | null;
    },
    setCreateOrderSelectedData: (data: CreateOrderSelectedData) => void;
    clearCreateOrderSelectedData: (field: keyof CreateOrderSelectedData) => void;

    devicesChecks: DeviceCheck[];

    setTmpOrder: (data: any) => void,
    createOrder: () => Promise<void>,
    clearAfterCreateOrder: () => void,
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: {} as Order,
  tmpOrder: null,
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

  initializeOrderCreationData: async () => {
    const { customers, brands, deviceTypes, devices, devicesChecks } = await getOrderCreationData();

    useCustomerStore.getState().setCustomers(customers);
    useDeviceStore.getState().setDevices(devices);
    useBrandStore.getState().setBrands(brands);
    useDeviceTypeStore.getState().setDeviceTypes(deviceTypes);

    set({ devicesChecks });
  },

  createOrderSelectedData: {
    customer: null,
    deviceId: null,
    deviceLabel: null,
    deviceTypeId: null,
    deviceTypeLabel: null,
    temporaryDeviceUnitId: null,
  },

  devicesChecks: [],

  setCreateOrderSelectedData: (data: CreateOrderSelectedData): void => {
    set((state) => ({
      createOrderSelectedData: {
        customer: data.customer ?? state.createOrderSelectedData.customer,
        deviceId: data.deviceId ?? state.createOrderSelectedData.deviceId,
        deviceLabel: data.deviceLabel ?? state.createOrderSelectedData.deviceLabel,
        deviceTypeId: data.deviceTypeId ?? state.createOrderSelectedData.deviceTypeId,
        deviceTypeLabel: data.deviceTypeLabel ?? state.createOrderSelectedData.deviceTypeLabel,
        temporaryDeviceUnitId: data.temporaryDeviceUnitId ?? state.createOrderSelectedData.temporaryDeviceUnitId,
      },
    }));
  },

  clearCreateOrderSelectedData: (field: keyof CreateOrderSelectedData) => {
    set((state) => ({
      createOrderSelectedData: {
        ...state.createOrderSelectedData,
        [field]: null,
      },
    }));
  },

  setTmpOrder: (newTmpOrder: any) => {
    set((state) => ({
      tmpOrder: {
        ...state.tmpOrder,
        ...newTmpOrder
      }
    }));
  },

  createOrder: async (): Promise<void> => {
    const tmpOrder = useOrderStore.getState().tmpOrder;
    const createOrderSelectedData = useOrderStore.getState().createOrderSelectedData;
    tmpOrder.customerId = createOrderSelectedData.customer?.id;
    tmpOrder.tempDeviceUnitId = createOrderSelectedData.temporaryDeviceUnitId;
    tmpOrder.deviceid = createOrderSelectedData.deviceId;

    await createOrder(tmpOrder);

    useOrderStore.getState().clearAfterCreateOrder();
  },

  clearAfterCreateOrder: () => {
    set({
      tmpOrder: null,
      createOrderSelectedData: {
        customer: null,
        deviceId: null,
        deviceLabel: null,
        deviceTypeId: null,
        deviceTypeLabel: null,
        temporaryDeviceUnitId: null,
      }
    });
  },
}));

export default useOrderStore;