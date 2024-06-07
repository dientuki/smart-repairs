interface Board {
    columns: Map<TypedColumn, Colum>;
}

type TypedColumn = "for budgeting" | "budgeting" | "budgeted" | "to do" | "repairing" | "repaired";

interface Column {
    id: TypedColumn;
    orders: Order[];
}

interface Customer {
    id: string;
    label: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
}

interface Device {
    id: string;
    label: string;
    commercialName?: string;
    techName?: string;
    brand?: string;
    type?: string;
    url?: string;
}

interface Order {
    $id: string;
    createdAt: timestamp;
    createdAtDate: Date;
    status: TypedColumn;
    brand: string,
    brandImage: string,
    deviceType: string,
    deviceTypeImage?: string,
    deviceCommercialName: string,
    deviceTechName: string,
    deviceSerial: string,
    customerFullName: string,
    observation: string,
    comments?: OrderComment[],
    commentsQuantity?: number,
}

interface OrderComment {
    id: string;
    comment: string;
    createdAt: string;
    createdAtDate: Date;
    isPublic: boolean;
    userId: string;
    userName: string;
    wasEdited: boolean;
}

interface NewOrderComment {
    comment: string;
    isPublic: boolean;
    orderId: string;
}

interface Images {
    bucketId: string;
    fileId: string;
}