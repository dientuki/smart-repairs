import { graphqlRequest, handleGraphQLErrors } from "@/helper/functions";
import { deviceVersion } from "@/helper/reduce";

export const getDeviceVersions = async(deviceId: string): Promise<OptionType[]> => {
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
}