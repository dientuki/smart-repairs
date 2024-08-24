import { create } from 'zustand'
import { addTemporaryDeviceUnit, getDevicesUnitsByVersionId } from "@/lib/deviceUnits";
import { getDeviceVersions } from "@/lib/deviceVersions";
import { useBrandStore, useDeviceTypeStore, useOrderStore }  from "@/store";
import { device } from "@/helper/reduce";

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
  clearDeviceVersions: () => void,

  deviceUnitsByVersion: OptionType[],
  getDevicesUnitsByVersion: (versionId: string) => Promise<void>,

  deviceUnitSelected: {
    version: OptionType | null;
    serial: OptionType | null;
  },
  setDeviceUnitSelected: (data: DeviceUnitSelectedUpdate) => void;

  addTemporaryDeviceUnit: (data: TemporaryDeviceUnitInput) => Promise<any>;
  updateDeviceInStore: (device: OptionType) => void;
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

  deviceUnitsByVersion: [],
  getDevicesUnitsByVersion: async (versionId: string): Promise<void> => {
    const deviceUnitsByVersion: OptionType[] = await getDevicesUnitsByVersionId(versionId);
    set({ deviceUnitsByVersion });
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

}));

export default useDeviceStore;