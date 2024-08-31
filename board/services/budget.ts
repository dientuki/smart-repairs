import { graphqlRequest, handleGraphQLErrors, handlePayloadErrors } from "@/helper/graphqlHelpers";
import { extra } from "@/helper/reduceHelpers";
import { arrayToString } from "@/helper/stringHelpers";

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

export const updateBudget = async(orderId: string, data: any) : Promise<boolean> => {
  const response = await graphqlRequest(`
    mutation {
      updateBudget(
        orderId: "${orderId}",
        budgetItems: ${arrayToString(data)}
      ) {
        __typename
        ... on UpdateBudgetPayload {
          success
        }
        ... on ErrorPayload {
          message
          code
        }
      }
    }
  `);


  handleGraphQLErrors(response.errors);
  handlePayloadErrors(response.data.updateBudget);

  return response.data.updateBudget.success
}