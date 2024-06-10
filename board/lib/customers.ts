import { graphqlRequest } from "@/helper/functions";

export const createCustomer = async(customer: Customer) => {

    const data = await graphqlRequest(`
                        mutation {
                            addCustomer(customer: {
                                first_name: "${customer.firstName}"
                                last_name: "${customer.lastName}"
                                phone: "${customer.phone}"
                                email: "${customer.email}"
                            }) {
                                id
                            }
                        }
                    `);

    const json = await data.json();

    return json.data.addCustomer.id;
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