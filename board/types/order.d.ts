interface Order {
  $id: string;
  createdAt: timestamp;
  createdAtDate: Date;
  creator: string;
  creatorAvatar: string;
  assignee: string | null;
  assigneeAvatar: string | null;
  status: TypedColumn;
  brand: string,
  brandImage: string,
  deviceType: string,
  deviceUnitId: string | null,
  deviceTypeImage?: string,
  deviceCommercialName: string,
  deviceTechName?: string,
  deviceSerial?: string,
  customerFullName: string,
  customerPhone?: string,
  observation: string,
  comments?: OrderComment[],
  commentsQuantity?: number,
  hasBudget: boolean;
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

interface NewOrder {
  customerId: string | null | undefined;
  observation: String;
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