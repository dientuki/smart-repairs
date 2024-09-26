declare global {
  interface GraphQLErrorExtension {
    validation?: any;
  }

  interface GraphQLError {
    message: string;
    extensions?: GraphQLErrorExtension;
  }
}

export {};
