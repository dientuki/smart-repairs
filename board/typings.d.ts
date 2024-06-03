interface Board {
    columns: Map<TypedColumn, Colum>;
}

type TypedColumn = "for budgeting" | "budgeting" | "budgeted" | "to do" | "repairing" | "repaired";

interface Column {
    id: TypedColumn;
    orders: Order[];
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
    comments?: Comment[],
    commentsQuantity?: number,
}

interface Comment {
    id: string;
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