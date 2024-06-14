interface Board {
    columns: Map<TypedColumn, Colum>;
}

type TypedColumn = "for budgeting" | "budgeting" | "budgeted" | "to do" | "repairing" | "repaired";

enum UnlockTypeEnum {
    NONE = 'none',
    CODE = 'code',
    PATTERN = 'pattern',
}
interface Column {
    id: TypedColumn;
    orders: Order[];
}

interface CustomerFullName {
    id?: string;
    fullName?: string;
}

interface Customer {
    id: string;
    label: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    [key: string]: string | undefined; // Add this line
}

interface DeviceInfo {
    id?: string;
    label?: string;
    typeid?: string | null;
}

interface Device {
    id: string;
    label: string;
    commercialName?: string;
    techName?: string;
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

interface NewDevice {
    id: string;
    brandid: string | null;
    typeid: string | null;
    commercialname: string;
    techname: string;
    url: string;
}

interface DeviceRepared {
    id: string;
    label: string;
    serial?: string;
    deviceId?: string;
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
    customerPhone?: string,
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

interface NewOrder {
    customerId?: String;
    observation: String;
    deviceUnitId: String;
}

interface Brand {
    id: string;
    label: string;
}

interface DeviceType {
    id: string;
    label: string;
}

interface GraphQLErrorExtension {
    validation?: any;
}

interface GraphQLError {
    message: string;
    extensions?: GraphQLErrorExtension;
}