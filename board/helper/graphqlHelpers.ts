import { GraphQLBusinessError } from "@/helper/GraphQLBusinessError";

type GraphQLErrors = GraphQLError[];

type PayloadErrors = {
  status: boolean;
  i18nKey: string;
  code: number;
  message: string;
};

export const graphqlRequest = async (query: string) => {
  try {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });

    return await response.json();
  } catch {
    throw new Error("network");
  }
};

export const handleGraphQLErrors = (errors: GraphQLErrors | undefined) => {
  if (errors && errors.length > 0) {
    if (errors[0].extensions && errors[0].extensions.validation) {
      throw errors[0].extensions.validation;
    } else {
      throw new Error("data");
    }
  }
};

export const handlePayloadErrors = (errors: PayloadErrors) => {
  if (errors.status === false) {
    throw new GraphQLBusinessError(errors.i18nKey);
  }
};

export const escapeGraphQLString = (str: string) => {
  return str
    .replace(/\\/g, "\\\\") // Escapa los backslashes
    .replace(/"/g, '\\"') // Escapa las comillas dobles
    .replace(/\n/g, "\\n"); // Escapa los saltos de línea
};
