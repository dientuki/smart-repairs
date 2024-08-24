import { create } from 'zustand'
import { addTemporaryDeviceUnit, confirmDeviceUnit, getDevicesUnitsByVersionId, getDeviceUnitUpdate, getTemporaryDeviceUnit } from "@/lib/deviceUnits";
import { getDeviceVersions } from "@/lib/deviceVersions";
import { useBrandStore, useDeviceTypeStore, useOrderStore }  from "@/store";
import { device } from "@/helper/reduce";
import { getDevicesByTypeAndBrand } from "@/lib/devices";

/*
  get To retrieve data from the server
  add To add data to the server

  clear To clear data from the store
  set To set data in the store
*/

interface DeviceUnitSelectedUpdate {
  version?: OptionType | null;
  serial?: OptionType | null;
}
interface DeviceStore {
  devices : OptionType[],
  setDevices: (devices: OptionType[]) => void;

  deviceVersions: OptionType[],
  getDeviceVersions: (device: string) => Promise<void>,

  deviceUnitsByVersion: OptionType[],
  getDevicesUnitsByVersion: (versionId: string) => Promise<void>,
  clearDeviceVersions: () => void,

  deviceUnitSelected: {
    version: OptionType | null;
    serial: OptionType | null;
  },
  setDeviceUnitSelected: (data: DeviceUnitSelectedUpdate) => void;

  addTemporaryDeviceUnit: (data: TemporaryDeviceUnitInput) => Promise<any>;
  updateDeviceInStore: (device: OptionType) => void;

  deviceUnit: any,
  getDeviceUnitUpdate: (id: string, deviceUnit: string | null) => Promise<void>;
  getDevicesByTypeAndBrand: (typeId: string, brandId: string) => Promise<void>;
  clear: (fields: string | string[]) => void;

  confirmDeviceUnit: (data: any) => Promise<void>;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  devices: [],
  setDevices: (devices: OptionType[]) => {
    set({ devices });
  },

  deviceVersions: [],
  getDeviceVersions: async (deviceId: string): Promise<void> => {
    const deviceVersions: OptionType[] = await getDeviceVersions(deviceId);
    set({ deviceVersions });
  },

  deviceUnitsByVersion: [],
  getDevicesUnitsByVersion: async (versionId: string): Promise<void> => {
    const deviceUnitsByVersion: OptionType[] = await getDevicesUnitsByVersionId(versionId);
    set({ deviceUnitsByVersion });
  },

  clearDeviceVersions: () => {
    set({
      deviceVersions: [],
      deviceUnitsByVersion: [],
      deviceUnitSelected: {
        version: null,
        serial: null,
      },
    });
  },

  deviceUnitSelected: {
    version: null,
    serial: null
  },

  setDeviceUnitSelected: (data: DeviceUnitSelectedUpdate): void => {
    set((state) => ({
      deviceUnitSelected: {
        version: data.version ?? state.deviceUnitSelected.version,
        serial: data.serial ?? state.deviceUnitSelected.serial,
      },
    }));
  },

  addTemporaryDeviceUnit: async (data: TemporaryDeviceUnitInput): Promise<any> => {
    const response = await addTemporaryDeviceUnit(data);

    useBrandStore.getState().updateBrandInStore(response.brand);
    useDeviceTypeStore.getState().updateDeviceTypeInStore(response.deviceType);
    useDeviceStore.getState().updateDeviceInStore(device([response.device])[0]);
    useOrderStore.getState().setCreateOrderSelectedData({temporaryDeviceUnitId: response.temporarydeviceunit});

    //return await addTemporaryDeviceUnit(data);
  },

  updateDeviceInStore: (device: OptionType) => {
    set((state) => {
      const existingIndex = state.devices.findIndex((b) => b.id === device.id);

      if (existingIndex >= 0) {
        // Update the existing brand
        const updatedDevices = [...state.devices];
        updatedDevices[existingIndex] = device;
        return { devices: updatedDevices };
      } else {
        // Add the new brand
        return { devices: [...state.devices, device] };
      }
    });
  },

  deviceUnit: {} as any,

  getDeviceUnitUpdate: async (orderId: string, deviceUnit: string | null): Promise<void> => {
    let result;
    if (deviceUnit) {
      result = await getDeviceUnitUpdate(deviceUnit);
    } else {
      result = await getTemporaryDeviceUnit(orderId);
    }

    useBrandStore.getState().setBrands(result.brands);
    useDeviceTypeStore.getState().setDeviceTypes(result.types);
    set({
      devices: result.devices,
      deviceVersions: result.versions,
      deviceUnitsByVersion: result.serials,
      deviceUnit: result.deviceUnit
    });
  },

  clear: (fields: string | string[]) => {
    set((state) => {
      // Convertir el argumento en un array si es un string
      const fieldsArray = Array.isArray(fields) ? fields : [fields];
      const newState: Partial<DeviceStore> = { ...state };

      // Limpiar los campos especificados
      fieldsArray.forEach(field => {
        if (field in newState) {
          (newState as any)[field] = [];
        }
      });

      return newState as DeviceStore;
    });
  },

  getDevicesByTypeAndBrand: async (typeId: string, brandId: string): Promise<void> => {
    const devices: OptionType[] = await getDevicesByTypeAndBrand(typeId, brandId);
    set({ devices });
  },

  confirmDeviceUnit: async(data: any): Promise<void> => {
    const response = await confirmDeviceUnit(data);
    set({ deviceUnit: response });
  }

}));

export default useDeviceStore;