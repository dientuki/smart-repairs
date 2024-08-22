import { graphqlRequest, handleGraphQLErrors } from "@/helper/functions";
import { extra } from "@/helper/reduce";

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

export const updateDevice = async(device: NewDevice) => {
    const response = await graphqlRequest(`
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

export const getDevicesByTypeAndBrand = async(type:String, brand:String): Promise<OptionType[]> => {
    const response = await graphqlRequest(`
        query {
            deviceByTypeAndBrand(typeId: "${type}", brandId: "${brand}") {
                    id
                    label
                    url
            }
        }
    `);

    handleGraphQLErrors(response.errors);

    return extra(response.data.deviceByTypeAndBrand);
}