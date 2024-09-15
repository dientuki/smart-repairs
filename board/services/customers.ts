import { graphqlRequest, handleGraphQLErrors } from "@/helper/graphqlHelpers";
import { extra } from "@/helper/reduceHelpers";

export const getCustomers = async () => {
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
export const createCustomer = async (customer: CustomerInput) => {
  const response = await graphqlRequest(`
                        mutation {
                            addCustomer(customer: {
                                firstname: "${customer.firstname}"
                                lastname: "${customer.lastname}"
                                phone: "${customer.phone}"
                                email: "${customer.email}"
                            }) {
                                id
                            }
                        }
                    `);

  handleGraphQLErrors(response.errors);

  return response.data.addCustomer.id;
};

export const updateCustomer = async (customer: CustomerInput) => {
  const response = await graphqlRequest(`
        mutation {
            updateCustomer(customerId: "${customer.id}", customer: {
                firstname: "${customer.firstname}"
                lastname: "${customer.lastname}"
                phone: "${customer.phone}"
                email: "${customer.email}"
            })
        }
    `);

  handleGraphQLErrors(response.errors);

  return response.data.updateCustomer;
};
