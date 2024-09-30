declare global {
  type GraphQLScalarValue = string | number | boolean | null;
  type GraphQLValue = GraphQLScalarValue | GraphQLObject | GraphQLObject[];

  interface GraphQLErrorExtension {
    validation?: any;
  }

  interface GraphQLBusinessError extends Error {
    i18nKey: string;
  }

  interface GraphQLError {
    message: string;
    extensions?: GraphQLErrorExtension;
  }

  interface GraphQLObject {
    [key: string]: GraphQLValue;
  }

  interface QueryResponse<T extends GraphQLObject = GraphQLObject> {
    [key: string]: T[];
  }
}

export {};
