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
    id: string;
    label: string;
    type: string;
    typeId: string;
}

interface DeviceVersion {
    id: string;
    label: string;
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
    deviceBrand: string;
    deviceType: string
    commercialName: string;
    deviceVersion: string | null;
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

interface Order {
    $id: string;
    createdAt: timestamp;
    createdAtDate: Date;
    author: string;
    status: TypedColumn;
    brand: string,
    brandImage: string,
    deviceType: string,
    deviceTypeImage?: string,
    deviceCommercialName: string,
    deviceTechName?: string,
    deviceSerial?: string,
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
    customerId: String | null | undefined;
    observation: String;
    damages: [damage];
    damageDescription: String;
    features: [feature];
    featureDescription: String;
    tempDeviceUnitId: String;
    deviceid: String;
}

interface Step3data {
    damages: [damage];
    damageDescription: String;
    features: [feature];
    featureDescription: String;
    observation: String;
}

interface damage {
    value: string;
    checked: boolean;
}

interface feature {
    value: string;
    checked: boolean;
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

interface DeviceChecks {
    deviceTypeId: String,
    damages: [damage];
    features: [feature];
}

interface GraphQLErrorExtension {
    validation?: any;
}

interface GraphQLError {
    message: string;
    extensions?: GraphQLErrorExtension;
}

interface CustomerDeviceUnit {
    deviceid: string;
    commercialname: string;
    url: string;
    brandid: string | '';
    typeid: string | '';
    deviceunitid: string | '';
    unlocktype: UnlockTypeEnum;
    unlockcode: number[] | null;
    deviceversionid: string | null;
    serial: string;
}

interface OptionType {
    id: string;
    label: string;
}