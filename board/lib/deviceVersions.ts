import { graphqlRequest, handleGraphQLErrors } from "@/helper/functions";

export const getDeviceVersions = async(device: String): Promise<DeviceVersion[]> => {

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

    return response.data.deviceVersions.reduce((acc: DeviceVersion[], deviceVersion: any) => {
        const desc = deviceVersion.description? ` (${deviceVersion.description})` : '';
        acc.push({
            id: deviceVersion.id,
            label: deviceVersion.version + desc
        });

        return acc;

    }, []) as DeviceVersion[];
}