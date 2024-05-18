interface Board {
    columns: Map<TypedColumn, Colum>;
}

type TypedColumn = "for budgeting" | "budgeting" | "budgeted" | "to do" | "repairing" | "repaired";

interface Column {
    id: TypedColumn;
    todos: Todo[];
}

interface Todo {
    $id: string;
    $createdAt: string;
    status: TypedColumn;
    brand: string,
    brandImage: string,
    deviceType: string,
    deviceTypeImage?: string,
    deviceCommercialName: string,
    deviceTechName: string,
}

interface Images {
    bucketId: string;
    fileId: string;
}