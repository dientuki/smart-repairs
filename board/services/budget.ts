import {
  graphqlRequest,
  handleGraphQLErrors,
  handlePayloadErrors,
} from "@/helper/graphqlHelpers";
import { extra } from "@/helper/reduceHelpers";
import { arrayToString } from "@/helper/stringHelpers";
import { PackageType } from "@/types/enums";

export const getInitialValues = async (
  cpackage: string,
  orderId?: string,
): Promise<any> => {
  // Construir la consulta dinámicamente según si `orderId` está presente o no
  const query = `
    query {
      morph {
        part
        discount
        serviceJob
      }
      discounts {
        id
        label
        price
        type
      }
      services {
        id
        label
        price
      }
      ${
        orderId && cpackage !== PackageType.Basic
          ? `
        partsByOrder(orderId: "${orderId}") {
          id
          label
          price
          stock
          image
        }
      `
          : ""
      }
      ${
        orderId
          ? `
        budget(orderId: "${orderId}") {
          id
          subtotal
          discount
          items {
            id
            itemable_id
            itemable_type
            quantity
            unit_price
            item_total
            include_in_sum
          }
        }
      `
          : ""
      }
    }
  `;

  const response = await graphqlRequest(query);

  handleGraphQLErrors(response.errors);

  return {
    discounts: extra(response.data.discounts, {
      item_type: response.data.morph.discount,
    }),
    services: extra(response.data.services, {
      item_type: response.data.morph.serviceJob,
    }),
    parts: response.data.partsByOrder
      ? extra(response.data.partsByOrder, {
          item_type: response.data.morph.part,
        })
      : [],
    budget: response.data.budget ? response.data.budget : null,
  };
};

export const updateBudget = async (
  orderId: any,
  budgetItems: any,
): Promise<boolean> => {
  console.log(`
    mutation {
      updateBudget(
        orderId: "${orderId}",
        budgetItems: ${arrayToString(budgetItems)}
      ) {
        __typename
        ... on UpdateBudgetPayload {
          success
        }
        ... on ErrorPayload {
          status
          i18nKey
        }
      }
    }
  `);

  const response = await graphqlRequest(`
    mutation {
      updateBudget(
        orderId: "${orderId}",
        budgetItems: ${arrayToString(budgetItems)}
      ) {
        __typename
        ... on UpdateBudgetPayload {
          success
        }
        ... on ErrorPayload {
          status
          i18nKey
        }
      }
    }
  `);

  handleGraphQLErrors(response.errors);
  handlePayloadErrors(response.data.updateBudget);

  return response.data.updateBudget.success;
};
