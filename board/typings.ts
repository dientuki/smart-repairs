interface DeviceInfo {
  id: string;
  label: string;
  type: string;
  typeId: string;
}

interface Device {
  id: string;
  label: string;
  commercialName?: string;
  brand?: string;
  type?: string;
  url?: string;
  [key: string]: string | undefined; // Add this line
}

interface DeviceUnit {
  id: string | null;
  serial: string;
  unlockType: UnlockTypeEnum;
  unlockCode?: string;
  deviceId: string | null;
}

interface temporaryDeviceUnit {
  serial: string;
  brand_id: string;
  type_id: string;
  device_id: string;
  device_version_id: string | null;
  device_unit_id: string;
  url: string;
}

interface NewDeviceUnit {
  id: string | null;
  deviceid?: string;
  serial: string;
  unlocktype: UnlockTypeEnum;
  unlockcode?: string;
}

interface NewDevice {
  id: string;
  brandid: string | null;
  typeid: string | null;
  commercialname: string;
  url: string;
}

interface DeviceRepared {
  id: string;
  label: string;
  serial?: string;
  deviceId?: string;
}

interface Images {
  bucketId: string;
  fileId: string;
}

interface checks {
  damages: [damage];
  features: [feature];
}

interface Brand {
  id: string;
  label: string;
}

interface DeviceType {
  id: string;
  label: string;
}

interface CustomerDeviceUnit {
  deviceid: string;
  commercialname: string;
  url: string;
  brandid: string | "";
  typeid: string | "";
  deviceunitid: string | "";
  unlocktype: UnlockTypeEnum;
  unlockcode: number[] | null;
  deviceversionid: string | null;
  serial: string;
}
