import {
  graphqlRequest,
  handleGraphQLErrors,
  handlePayloadErrors,
} from "@/helper/graphqlHelpers";
import { extra } from "@/helper/reduceHelpers";

export const getCustomers = async (): Promise<OptionType[]> => {
  const response = await graphqlRequest(`
            query {
              customers {
                id
                label
                first_name
                last_name
                phone
                email
              }
            `);

  handleGraphQLErrors(response.errors);

  return extra(response.data.customers);
};
export const upsertCustomer = async (
  customer: CustomerInput,
): Promise<QueryResponse> => {
  const response = await graphqlRequest(`
                        mutation {
                            upsertCustomer(customer: {
                              id: "${customer.id}"
                              firstname: "${customer.firstname}"
                              lastname: "${customer.lastname}"
                              phone: "${customer.phone}"
                              email: "${customer.email}"
                            }) {
                                __typename
                                ... on UpsertCustomerPayload {
                                    customer {
                                        id
                                        label
                                        first_name
                                        last_name
                                        phone
                                        email
                                    }
                                    operation
                                }
                                ... on ErrorPayload {
                                    status
                                    i18nKey
                                }
                            }
                        }
                    `);

  handleGraphQLErrors(response.errors);
  handlePayloadErrors(response.data.upsertCustomer);

  return response.data.upsertCustomer;
};
