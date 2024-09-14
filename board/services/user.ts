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

  return response.data.currentUser as User;
};
