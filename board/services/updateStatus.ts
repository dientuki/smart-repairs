import {
  graphqlRequest,
  handleGraphQLErrors,
  handlePayloadErrors,
} from "@/helper/graphqlHelpers";
import { TypedColumn } from "@/types/enums";

export const updateStatus = async (taskId: string, columnId: TypedColumn) => {
  const response = await graphqlRequest(`
    mutation {
      updateOrderStatus(id: "${taskId}", status: "${columnId}")
      {
        __typename
        ... on UpdateOrderPayload {
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
  handlePayloadErrors(response.data.updateOrderStatus);
};
