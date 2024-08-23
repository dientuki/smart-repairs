import { create } from 'zustand'
import { addTemporaryDeviceUnit, getDevicesUnitsByVersionId } from "@/lib/deviceUnits";
import { getDeviceVersions } from "@/lib/deviceVersions";

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

  addTemporaryDeviceUnit: (data: TemporaryDeviceUnitInput) => Promise<any>
}

export const useDeviceStore = create<DeviceStore>((set) => ({
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
    return await addTemporaryDeviceUnit(data);
  },

}));