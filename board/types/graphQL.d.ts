interface GraphQLErrorExtension {
  validation?: any;
}

interface GraphQLError {
  message: string;
  extensions?: GraphQLErrorExtension;
}
