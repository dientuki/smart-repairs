interface Board {
    columns: Map<TypedColumn, Colum>;
}

type TypedColumn = "for budgeting" | "budgeting" | "budgeted" | "to do" | "repairing" | "repaired";

interface Column {
    id: TypedColumn;
    todos: Order[];
}

interface Order {
    $id: number;
    createdAt: timestamp;
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
    comments?: string
}

interface Images {
    bucketId: string;
    fileId: string;
}