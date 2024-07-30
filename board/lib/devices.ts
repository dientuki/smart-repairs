import { graphqlRequest, handleGraphQLErrors } from "@/helper/functions";

export const createDevice = async(device: NewDevice) => {

    const response = await graphqlRequest(`
                mutation {
                    addDevice(device: {
                        typeid: "${device.typeid}"
                        brandid: "${device.brandid}"
                        commercialname: "${device.commercialname}"
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
                    updateDevice(device: {
                        id: "${device.id}"
                        typeid: "${device.typeid}"
                        brandid: "${device.brandid}"
                        commercialname: "${device.commercialname}"
                        url: "${device.url}"
                    })
                }
            `);

    handleGraphQLErrors(response.errors);

    return response.data.updateDevice;
}