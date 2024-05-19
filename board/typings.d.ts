interface Board {
    columns: Map<TypedColumn, Colum>;
}

type TypedColumn = "for budgeting" | "budgeting" | "budgeted" | "to do" | "repairing" | "repaired";

interface Column {
    id: TypedColumn;
    orders: Order[];
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
    comments?: Comment[]
}

interface Comment {
    id: number;
    comment: string;
    created_at: timestamp;
    is_public: boolean;
    user: {
        name: string;
    }
}

interface Images {
    bucketId: string;
    fileId: string;
}