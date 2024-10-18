import { TypedColumn } from "./enums";

declare global {
  interface OrderBase {
    $id: string;
    brand: string;
    status: TypedColumn;
    deviceType: string;
    customerFullName: string;
    createdAt: timestamp;
    createdAtDate: Date;
    observation: string;
  }

  interface OrderPreview extends OrderBase {
    // Order in boar
    brandImage: string;
    commentsQuantity?: number;
    deviceTypeImage?: string;
    deviceCommercialName: string;
    deviceTechName?: string;
    deviceSerial?: string;
  }

  interface OrderExpanded extends OrderBase {
    // Order in card
    creator: string;
    creatorAvatar: string;
    assignee: string | undefined;
    assigneeAvatar: string | undefined;
    hasBudget: boolean;
    diagnosis: string | undefined;
    customerPhone?: string;
    comments?: OrderComment[];
    deviceUnitId: string | null;
    orderCheck: OrderCheck;
  }

  interface OrderComment {
    id: string;
    comment: string;
    createdAt: string;
    createdAtDate: Date;
    isPublic: boolean;
    userId: string;
    userName: string;
    userImage: string;
    wasEdited: boolean;
  }

  interface RawOrderComment {
    id: string;
    comment: string;
    created_at: string;
    is_public: boolean;
    user_id: string;
    user: {
      name: string;
      imageUrl: string;
    };
    was_edited: boolean;
  }

  interface NewOrder {
    customerId: string | null | undefined;
    observation: string;
    damages: [damage];
    damageDescription: string;
    features: [feature];
    featureDescription: string;
    tempDeviceUnitId: string | null | undefined;
    deviceid: string | null | undefined;
  }

  interface damage {
    value: string;
    checked: boolean;
  }

  interface feature {
    value: string;
    checked: boolean;
  }

  interface DeviceCheck {
    deviceTypeId: string;
    damages: [damage];
    features: [feature];
  }

  interface CreateOrUpdateComment {
    comment: string;
    ispublic: boolean;
  }

  interface OrderCheck {
    damages: DamageFeatureDetail[];
    damagesDescription?: string;
    features: DamageFeatureDetail[];
    featuresDescription?: string;
  }

  interface DamageFeatureDetail {
    value: string;
    checked: boolean;
  }

  interface OrderCreationData {
    customers: OptionType[];
    brands: OptionType[];
    devices: OptionType[];
    deviceTypes: OptionType[];
    devicesChecks: DeviceCheck[];
    budgetTableData: OptionType[];
  }

  interface tmpDeviceUnitTable {
    id?: string;
    serial: string | null;
    unlockType: string;
    unlockCode: string | null;
    device: OptionType;
    deviceVersion: OptionType;
    deviceUnit: string;
  }

  interface OrderChecksTable {
    damages: damage[];
    features: feature[];
    damagesDescription: string;
    featuresDescription: string;
  }

  interface OrderTable {
    customer: OptionType;
    observation: string;
  }

  interface OrderData {
    order: OrderTable;
    orderChecks: OrderChecksTable;
    tmpDeviceUnit: tmpDeviceUnitTable;
    money: number;
  }
}

export {};
