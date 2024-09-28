declare global {
  interface OptionType {
    id: string;
    label: string;
    info?:
      | string
      | null
      | {
          [key: string]: string | null;
        };
  }
  interface User {
    id: string;
    name: string;
    imageUrl: string;
    package: string;
    currency: string;
  }

  interface Board {
    columns: Map<TypedColumn, Colum>;
  }

  interface Column {
    id: TypedColumn;
    orders: Order[];
  }

  interface GraphQLBusinessError extends Error {
    i18nKey: string;
  }
}

export {};
