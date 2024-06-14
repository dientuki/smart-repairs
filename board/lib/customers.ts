import { graphqlRequest, handleGraphQLErrors } from "@/helper/functions";

export const createCustomer = async(customer: Customer) => {

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

    return response.addCustomer.id;
}

export const updateCustomer = async(customer: Customer) => {
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