interface OptionType {
  id: string;
  label: string;
  info?: string | null | {
    [key: string]: string | null;
  };
}

interface User {
  id: string;
  name: string;
  imageUrl: string;
  package: string;
}

interface Board {
  columns: Map<TypedColumn, Colum>;
}

interface Column {
  id: TypedColumn;
  orders: Order[];
}