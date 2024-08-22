import { graphqlRequest, handleGraphQLErrors } from "@/helper/functions";
import { deviceVersion } from "@/helper/reduce";

export const getDeviceVersions = async(device: String): Promise<OptionType[]> => {

    const response = await graphqlRequest(`
                query {
                    deviceVersions(device_id:"${device}") {
                        id
                        version
                        description
                    }
                }
            `);

    handleGraphQLErrors(response.errors);

    return deviceVersion(response.data.deviceVersions);
}