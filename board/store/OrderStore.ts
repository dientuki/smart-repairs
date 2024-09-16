import { create } from "zustand";
import {
  getOrder,
  getOrderCreationData,
  updateDiagnosis,
  updateObservation,
} from "@/services/orders";
import {
  addComment,
  updateCommentVisibility,
  updateComment,
  deleteComment,
} from "@/services/comments";
import { createOrder } from "@/services/orders";
import {
  useCustomerStore,
  useDeviceStore,
  useBrandStore,
  useDeviceTypeStore,
} from "@/store";

interface CreateOrderSelectedData {
  customer?: OptionType | null;
  deviceId?: string | null;
  deviceLabel?: string | null;
  deviceTypeId?: string | null;
  deviceTypeLabel?: string | null;
  temporaryDeviceUnitId?: string | null;
}
interface OrderStore {
  order: Order;
  tmpOrder: NewOrder;
  getOrder: (id: string) => Promise<void>;

  updateCommentVisibility: (commentId: string, isPublic: boolean) => void;
  updateComment: (commentId: string, text: string) => void;
  deleteComment: (commentId: string) => void;
  addComment: (newComment: NewComment) => Promise<boolean>;

  initializeOrderCreationData: () => Promise<void>;
  createOrderSelectedData: {
    customer: OptionType | null;
    deviceId: string | null;
    deviceLabel: string | null;
    deviceTypeId: string | null;
    deviceTypeLabel: string | null;
    temporaryDeviceUnitId: string | null;
  };
  setCreateOrderSelectedData: (data: CreateOrderSelectedData) => void;
  clearCreateOrderSelectedData: (field: keyof CreateOrderSelectedData) => void;

  devicesChecks: DeviceCheck[];

  setTmpOrder: (data: any) => void;
  createOrder: () => Promise<void>;
  clearAfterCreateOrder: () => void;

  updateDiagnosis: (diagnosis: string) => Promise<boolean>;
  updateObservation: (observation: string) => Promise<boolean>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: {} as Order,
  tmpOrder: {} as NewOrder,
  getOrder: async (id: string) => {
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

  addComment: async (data: NewComment): Promise<boolean> => {
    const comment = await addComment(useOrderStore.getState().order.$id, data);

    if (comment) {
      set((state) => ({
        order: {
          ...state.order,
          comments: [comment, ...(state.order.comments || [])],
        },
      }));

      return true;
    }
    return false;
  },

  initializeOrderCreationData: async () => {
    const { customers, brands, deviceTypes, devices, devicesChecks } =
      await getOrderCreationData();

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
        deviceLabel:
          data.deviceLabel ?? state.createOrderSelectedData.deviceLabel,
        deviceTypeId:
          data.deviceTypeId ?? state.createOrderSelectedData.deviceTypeId,
        deviceTypeLabel:
          data.deviceTypeLabel ?? state.createOrderSelectedData.deviceTypeLabel,
        temporaryDeviceUnitId:
          data.temporaryDeviceUnitId ??
          state.createOrderSelectedData.temporaryDeviceUnitId,
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
        ...newTmpOrder,
      },
    }));
  },

  createOrder: async (): Promise<void> => {
    const tmpOrder = useOrderStore.getState().tmpOrder;
    const createOrderSelectedData =
      useOrderStore.getState().createOrderSelectedData;
    tmpOrder.customerId = createOrderSelectedData.customer?.id;
    tmpOrder.tempDeviceUnitId = createOrderSelectedData.temporaryDeviceUnitId;
    tmpOrder.deviceid = createOrderSelectedData.deviceId;

    await createOrder(tmpOrder);

    useOrderStore.getState().clearAfterCreateOrder();
  },

  clearAfterCreateOrder: () => {
    set({
      tmpOrder: {} as NewOrder,
      createOrderSelectedData: {
        customer: null,
        deviceId: null,
        deviceLabel: null,
        deviceTypeId: null,
        deviceTypeLabel: null,
        temporaryDeviceUnitId: null,
      },
    });
  },

  updateDiagnosis: async (diagnosis: string): Promise<boolean> => {
    const status = await updateDiagnosis(
      useOrderStore.getState().order.$id,
      diagnosis,
    );
    if (status) {
      set({ order: { ...useOrderStore.getState().order, diagnosis } });
    }
    return status;
  },

  updateObservation: async (observation: string): Promise<boolean> => {
    const status = await updateObservation(
      useOrderStore.getState().order.$id,
      observation,
    );
    if (status) {
      set({ order: { ...useOrderStore.getState().order, observation } });
    }
    return status;
  },
}));
