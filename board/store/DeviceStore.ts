import { create } from "zustand";
import {
  addTemporaryDeviceUnit,
  confirmDeviceUnit,
  getDevicesUnitsByVersionId,
  getDeviceUnitUpdate,
  getTemporaryDeviceUnit,
} from "@/services/deviceUnits";
import { getDeviceVersions } from "@/services/deviceVersions";
import {
  device,
  deviceSingle,
  extra,
  extraSingle,
  deviceVersion,
} from "@/helper/reduceHelpers";
import { getDevicesByTypeAndBrand } from "@/services/devices";
import { FieldValues } from "react-hook-form";

/*
  get To retrieve data from the server
  add To add data to the server

  clear To clear data from the store
  set To set data in the store
*/

interface TemporaryDeviceUnit {
  brand: OptionType;
  type: OptionType;
  device: OptionType;
  deviceVersion: OptionType;
}

interface DeviceUnitSelectedUpdate {
  version?: OptionType | null;
  serial?: OptionType | null;
}
interface DeviceStore {
  devices: OptionType[];
  setDevices: (devices: OptionType[]) => void;

  deviceVersions: OptionType[];
  getDeviceVersions: (device: string) => Promise<OptionType[]>;

  deviceUnitsByVersion: OptionType[];
  getDevicesUnitsByVersion: (versionId: string) => Promise<OptionType[]>;
  clearDeviceVersions: () => void;

  deviceUnitSelected: {
    version: OptionType | null;
    serial: OptionType | null;
  };
  setDeviceUnitSelected: (data: DeviceUnitSelectedUpdate) => void;

  addTemporaryDeviceUnit: (data: FieldValues) => Promise<TemporaryDeviceUnit>;
  updateDeviceInStore: (device: OptionType) => void;

  deviceUnit: any;
  getDeviceUnitUpdate: (id: string, deviceUnit: string | null) => Promise<void>;
  getDevicesByTypeAndBrand: (
    typeId: string,
    brandId: string,
  ) => Promise<OptionType[]>;

  confirmDeviceUnit: (data: FieldValues) => Promise<boolean>;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  devices: [],
  setDevices: (devices: OptionType[]) => {
    set({ devices });
  },

  deviceVersions: [],
  getDeviceVersions: async (deviceId: string): Promise<OptionType[]> => {
    const response = await getDeviceVersions(deviceId);
    return response;
  },

  deviceUnitsByVersion: [],
  getDevicesUnitsByVersion: async (
    versionId: string,
  ): Promise<OptionType[]> => {
    const response = await getDevicesUnitsByVersionId(versionId);
    return response;
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
    serial: null,
  },

  setDeviceUnitSelected: (data: DeviceUnitSelectedUpdate): void => {
    set((state) => ({
      deviceUnitSelected: {
        version: data.version ?? state.deviceUnitSelected.version,
        serial: data.serial ?? state.deviceUnitSelected.serial,
      },
    }));
  },

  addTemporaryDeviceUnit: async (
    data: FieldValues,
  ): Promise<TemporaryDeviceUnit> => {
    const normalized = {
      brandid: data.brand.id,
      brandlabel: data.brand.label,

      typeid: data.type.id,
      typelabel: data.type.label,

      deviceid: data.deviceid,
      commercialname: data.commercialname,
      url: data.url,

      versionid: data.version?.id,
      versionlabel: data.version?.label,
    };

    const response = await addTemporaryDeviceUnit(normalized);

    return {
      brand: extraSingle(response.brand),
      type: extraSingle(response.deviceType),
      device: deviceSingle(response.device),
      deviceVersion: response.deviceVersion
        ? extraSingle(response.deviceVersion)
        : null,
    };

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

  getDeviceUnitUpdate: async (
    orderId: string,
    deviceUnit: string | null,
  ): Promise<void> => {
    let result;
    if (deviceUnit) {
      result = await getDeviceUnitUpdate(deviceUnit);
    } else {
      result = await getTemporaryDeviceUnit(orderId);
    }

    return result;
  },

  getDevicesByTypeAndBrand: async (
    typeId: string,
    brandId: string,
  ): Promise<OptionType[]> => {
    const devices: OptionType[] = await getDevicesByTypeAndBrand(
      typeId,
      brandId,
    );
    return devices;
  },

  confirmDeviceUnit: async (data: FieldValues): Promise<boolean> => {
    const dunno = {
      order: data.order,

      brandid: data.brand.id,
      brandlabel: data.brand.label,

      typeid: data.type.id,
      typelabel: data.type.label,

      deviceid: data.device.id,
      devicelabel: data.device.label,
      url: data.url,

      versionid: data.version.id,
      versionlabel: data.version.label,

      serialid: data.serial.id,
      seriallabel: data.serial.label,

      deviceunitid: data.deviceunitid,
    };
    const status = await confirmDeviceUnit(dunno);
    return status;
  },
}));
