import { graphqlRequest, handleGraphQLErrors } from "@/helper/graphqlHelpers";
import { extra } from "@/helper/reduceHelpers";

export const getInitialValues = async(orderId: string): Promise<any> => {
  const response = await graphqlRequest(`
      query {
          discounts {
              id
              label
              price
              discount_type
          }
          services {
              id
              label
              price
          }
      }
  `);

  handleGraphQLErrors(response.errors);

  /*
            parts(orderId: "${orderId}") {
            id
            label
            price
            stock
            image
          }
            */

  return {
    discounts: extra(response.data.discounts),
    services: extra(response.data.services),
    //parts: extra(response.data.parts)
  }
}