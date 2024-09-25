import { graphqlRequest, handleGraphQLErrors } from "@/helper/graphqlHelpers";

export const getCurrentUser = async (): Promise<User> => {
  const response = await graphqlRequest(`
        query {
            currentUser {
                id
                name
                imageUrl
                package
            }
        }
    `);
  handleGraphQLErrors(response.errors);

  const currentUserWithCurrency = {
    ...response.data.currentUser,
    currency: "$",
  };

  // Retornar el objeto con la propiedad currency
  return currentUserWithCurrency as User;
};
