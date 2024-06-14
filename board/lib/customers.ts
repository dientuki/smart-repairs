import { graphqlRequest } from "@/helper/functions";

export const createCustomer = async(customer: Customer) => {

    const data = await graphqlRequest(`
                        mutation {
                            addCustomer(customer: {
                                firstName: "${customer.firstName}"
                                lastName: "${customer.lastName}"
                                phone: "${customer.phone}"
                                email: "${customer.email}"
                            }) {
                                id
                            }
                        }
                    `);
    if (data.errors) {
        throw data.errors[0].extensions.validation;
    }

    return data.addCustomer.id;
}

export const updateCustomer = (customer: Customer) => {
    graphqlRequest(`
        mutation {
            updateCustomer(customerId: "${customer.id}", customer: {
                first_name: "${customer.firstName}"
                last_name: "${customer.lastName}"
                phone: "${customer.phone}"
                email: "${customer.email}"
            }) {
                id
            }
        }
    `);
};