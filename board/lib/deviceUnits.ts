import { graphqlRequest, handleGraphQLErrors, handleUndefined } from "@/helper/functions";

export async function createDeviceUnit(deviceUnit: NewDeviceUnit): Promise<string> {
    const response = await graphqlRequest(`
                mutation {
                    addDeviceUnit(deviceunit: {
                        serial: "${deviceUnit.serial}"
                        unlocktype: "${deviceUnit.unlocktype}"
                        unlockcode: "${deviceUnit.unlockcode}"
                        deviceid: "${deviceUnit.deviceid}"
                    }) {
                        id
                    }
                }
            `);

    handleGraphQLErrors(response.errors);

    return response.data.addDeviceUnit.id;
}

export async function updateDeviceUnit(deviceUnit: NewDeviceUnit): Promise<boolean> {
    const response = await graphqlRequest(`
                mutation {
                    updateDeviceUnit(deviceUnitId: "${deviceUnit.id}", deviceunit: {
                        serial: "${deviceUnit.serial}"
                        unlocktype: "${deviceUnit.unlocktype}"
                        unlockcode: "${deviceUnit.unlockcode}"
                    })
                }
            `);

    handleGraphQLErrors(response.errors);

    return response.data.updateDeviceUnit;
}

export async function setCustomerDeviceUnit(customerDeviceUnit: CustomerDeviceUnit): Promise<boolean> {
    const response = await graphqlRequest(`
        mutation {
            addCustomerDeviceUnit(
                device: {
                    id: "${customerDeviceUnit.deviceid}"
                    typeid: "${customerDeviceUnit.typeid}"
                    brandid: "${customerDeviceUnit.brandid}"
                    commercialname: "${customerDeviceUnit.commercialname}"
                    url: "${handleUndefined(customerDeviceUnit.url)}"
                },
                deviceunit: {
                    serial: "${handleUndefined(customerDeviceUnit.serial)}"
                    unlocktype: "${customerDeviceUnit.unlocktype}"
                    unlockcode: "${customerDeviceUnit.unlockcode}"
                    deviceunitid: "${handleUndefined(customerDeviceUnit.deviceunitid)}"
                    deviceversionid: "${handleUndefined(customerDeviceUnit.deviceversionid)}"

                }
            )
        }
    `);

    handleGraphQLErrors(response.errors);

    return response.data.addDeviceUnit.id;
}
