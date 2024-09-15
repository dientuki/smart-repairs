type GraphQLErrors = GraphQLError[];

type PayloadErrors = {
  status: boolean;
  message: string;
  code: string;
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
  } catch (error) {
    throw new Error("network");
  }
};

export const handleGraphQLErrors = (errors: GraphQLErrors | undefined) => {
  if (errors && errors.length > 0) {
    if (errors[0].extensions && errors[0].extensions.validation) {
      throw errors[0].extensions.validation;
    } else {
      //throw new Error(errors[0].message);
      //console.log(errors[0].message);
      throw new Error("data");
    }
  }
};

export const handlePayloadErrors = (errors: PayloadErrors) => {
  if (errors.status === false) {
    throw new Error(errors.message);
  }
};
