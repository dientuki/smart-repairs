import { graphqlRequest, handleGraphQLErrors } from "@/helper/graphqlHelpers";

export const getDeviceVersions = async (
  deviceId: string,
): Promise<OptionType[]> => {
  const response = await graphqlRequest(`
                query {
                    deviceVersions(device_id:"${deviceId}") {
                        id
                        label
                    }
                }
            `);

  handleGraphQLErrors(response.errors);

  return response.data.deviceVersions;
};
