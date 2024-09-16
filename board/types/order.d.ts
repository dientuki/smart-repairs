interface Order {
  $id: string;
  createdAt: timestamp;
  createdAtDate: Date;
  creator: string;
  creatorAvatar: string;
  assignee: string | undefined;
  assigneeAvatar: string | undefined;
  diagnosis: string | undefined;
  status: TypedColumn;
  brand: string;
  brandImage: string;
  deviceType: string;
  deviceUnitId: string | null;
  deviceTypeImage?: string;
  deviceCommercialName: string;
  deviceTechName?: string;
  deviceSerial?: string;
  customerFullName: string;
  customerPhone?: string;
  observation: string;
  comments?: OrderComment[];
  commentsQuantity?: number;
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

interface NewComment {
  comment: string;
  ispublic: boolean;
}
