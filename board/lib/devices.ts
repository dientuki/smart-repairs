import { graphqlRequest, handleGraphQLErrors } from "@/helper/functions";

export const createDevice = async(device: NewDevice) => {

    const response = await graphqlRequest(`
                mutation {
                    addDevice(device: {
                        type: "${device.type}"
                        brand: "${device.brand}"
                        commercialname: "${device.commercialname}"
                        techname: "${device.techname}"
                        url: "${device.url}"
                    }) {
                        id
                    }
                }
            `);

    handleGraphQLErrors(response.errors);

    return response.data.addDevice.id;
}

export const updateDevice = async(device: NewDevice) => {const response = await graphqlRequest(`
                mutation {
                    updateDevice(deviceId: "${device.id}", device: {
                        type: "${device.type}"
                        brand: "${device.brand}"
                        commercialname: "${device.commercialname}"
                        techname: "${device.techname}"
                        url: "${device.url}"
                    })
                }
            `);

    handleGraphQLErrors(response.errors);

    return response.data.updateDevice;
}