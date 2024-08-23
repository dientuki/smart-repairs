interface TemporaryDeviceUnitInput {
  deviceid: string;

  brandid: string;
  brandlabel: string;
  typeid: string;
  typelabel: string;
  commercialname: string;
  url?: string;

  unlockcode?: string;
  unlocktype: string;
  serialid?: string;
  seriallabel?: string;
  versionid?: string;
  versionlabel?: string;
}