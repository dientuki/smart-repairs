import { graphqlRequest, handleGraphQLErrors, handleUndefined, handlePayloadErrors } from "@/helper/functions";
import { deviceVersion } from "@/helper/reduce";

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
            ) {
                __typename
                ... on CustomerDeviceUnitPayload {
                    temporarydeviceunit
                    deviceid
                    status
                }
                ... on ErrorPayload {
                    message
                    code
                    status
                }
            }
        }
    `);

    handleGraphQLErrors(response.errors);
    handlePayloadErrors(response.data.addCustomerDeviceUnit);

    return response.data.addCustomerDeviceUnit;
}

export async function getTemporaryDeviceUnit(orderId: String): Promise<any> {
    let dv = null;
    const response = await graphqlRequest(`
        query {
            temporaryDeviceUnit(orderId: "${orderId}") {
                serial
                device {
                    brand {
                        name
                    }
                    deviceType {
                        name
                    }
                    commercial_name
                    url
                }
                deviceVersion {
                    version
                    description
                }
                device_unit_id
            }
            temporaryDeviceVersions(orderId: "${orderId}") {
                id
                version
                description
            }
            devicesByBrandWithTmpOrder(orderId: "${orderId}") {
                id
                label
                url
            }
            brands {
                id
                label
            }
            deviceTypes {
                id
                label
            }
        }
    `);

    handleGraphQLErrors(response.errors);



    if (response.data.temporaryDeviceUnit.deviceVersion) {
        const desc = response.data.temporaryDeviceUnit.deviceVersion.description? ` (${response.data.temporaryDeviceUnit.deviceVersion.description})` : '';
        dv = response.data.temporaryDeviceUnit.deviceVersion.version + desc;
    }

    return {
        temporaryDeviceUnit: {
            serial: response.data.temporaryDeviceUnit.serial,
            device_unit_id: response.data.temporaryDeviceUnit.device_unit_id,
            deviceBrand: response.data.temporaryDeviceUnit.device.brand.name,
            deviceType: response.data.temporaryDeviceUnit.device.deviceType.name,
            commercialName: response.data.temporaryDeviceUnit.device.commercial_name,
            url: response.data.temporaryDeviceUnit.device.url,
            deviceVersion: dv
        } as temporaryDeviceUnit,
        brands: response.data.brands,
        devices: response.data.devicesByBrandWithTmpOrder,
        deviceTypes: response.data.deviceTypes,
        deviceVersions: deviceVersion(response.data.temporaryDeviceVersions)
    }
}
