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
          partsByOrder(orderId: "${orderId}") {
            id
            label
            price
            stock
            image
          }
          budget(orderId: "${orderId}") {
            id
            total
            items {
              part_id
              service_job_id
              quantity
              unit_price
              include_in_sum
            }
          }
      }
  `);

  handleGraphQLErrors(response.errors);

  return {
    discounts: extra(response.data.discounts),
    services: extra(response.data.services),
    parts: extra(response.data.partsByOrder)
  }
}