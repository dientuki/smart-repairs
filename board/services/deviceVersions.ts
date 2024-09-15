import { graphqlRequest, handleGraphQLErrors } from "@/helper/graphqlHelpers";
import { deviceVersion } from "@/helper/reduceHelpers";

export const getDeviceVersions = async (
  deviceId: string,
): Promise<OptionType[]> => {
  const response = await graphqlRequest(`
                query {
                    deviceVersions(device_id:"${deviceId}") {
                        id
                        version
                        description
                    }
                }
            `);

  handleGraphQLErrors(response.errors);

  return deviceVersion(response.data.deviceVersions);
};
