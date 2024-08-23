import { create } from 'zustand'
import { getOrder, getOrderCreationData } from "@/lib/orders";
import { addComment, updateCommentVisibility, updateComment, deleteComment } from "@/lib/comments";
import { createOrder } from "@/lib/orders";
import { useCustomerStore, useDeviceStore } from "@/store";

interface CreateOrderSelectedData {
  customer?: OptionType | null;
  device?: string | null;
  deviceType?: string | null;
}
interface OrderStore {
    order: Order,
    getOrder: (id: string) => Promise<void>,

    updateCommentVisibility: (commentId: string, isPublic: boolean) => void
    updateComment: (commentId: string, text: string) => void,
    deleteComment: (commentId: string) => void,
    addComment: (newComment:NewOrderComment) => Promise<OrderComment>

    initializeOrderCreationData: () => Promise<void>
    createOrderSelectedData: {
      customer: OptionType | null;
      device: string | null;
      deviceType: string | null;
    },
    setCreateOrderSelectedData: (data: CreateOrderSelectedData) => void;
    clearCreateOrderSelectedData: (field: keyof CreateOrderSelectedData) => void;

    brands: OptionType[];
    deviceTypes: OptionType[];

    addOrder: (newOrder: NewOrder) => Promise<void>,
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

  initializeOrderCreationData: async () => {
    const setCustomers = useCustomerStore.getState().setCustomers;
    const setDevices = useDeviceStore.getState().setDevices;

    const { customers, brands, deviceTypes, devices } = await getOrderCreationData();

    setCustomers(customers);
    setDevices(devices);
    set({ brands, deviceTypes });
  },

  createOrderSelectedData: {
    customer: null,
    device: null,
    deviceType: null,
  },

  setCreateOrderSelectedData: (data: CreateOrderSelectedData): void => {
    set((state) => ({
      createOrderSelectedData: {
        customer: data.customer ?? state.createOrderSelectedData.customer,
        device: data.device ?? state.createOrderSelectedData.device,
        deviceType: data.deviceType ?? state.createOrderSelectedData.deviceType,
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

  brands: [],
  deviceTypes: [],

  addOrder: async (newOrder: NewOrder): Promise<void> => {
    return await createOrder(newOrder);
  }
}));

export default useOrderStore;