import { create } from 'zustand'

interface DeviceTypeStore {
  deviceTypes: OptionType[];
  setDeviceTypes: (deviceTypes: OptionType[]) => void;
  updateDeviceTypeInStore: (deviceType: OptionType) => void;
}

export const useDeviceTypeStore = create<DeviceTypeStore>((set) => ({
  deviceTypes: [],

  setDeviceTypes: (deviceTypes: OptionType[]) => {
    set({ deviceTypes });
  },

  updateDeviceTypeInStore: (deviceType: OptionType) => {
    set((state) => {
      const existingIndex = state.deviceTypes.findIndex((b) => b.id === deviceType.id);

      if (existingIndex >= 0) {
        // Update
        const updatedDeviceTypes = [...state.deviceTypes];
        updatedDeviceTypes[existingIndex] = deviceType;
        return { deviceTypes: updatedDeviceTypes };
      } else {
        // Add
        return { deviceTypes: [...state.deviceTypes, deviceType] };
      }
    });
  },

}));