import { graphqlRequest, handleGraphQLErrors } from "@/helper/graphqlHelpers";
import { extra } from "@/helper/reduceHelpers";

export const getDiscounts = async(): Promise<OptionType[]> => {
    const response = await graphqlRequest(`
        query {
            discounts {
                id
                label
                price
            }
        }
    `);
    handleGraphQLErrors(response.errors);

    return extra(response.data.discounts);
}

export const getServices = async(): Promise<OptionType[]> => {
    const response = await graphqlRequest(`
        query {
            services {
                id
                price
                label
            }
        }
    `);
    handleGraphQLErrors(response.errors);

    return extra(response.data.services);
}