import { graphqlRequest, handleGraphQLErrors, handleUndefined, handlePayloadErrors } from "@/helper/functions";
import { deviceVersion, extra } from "@/helper/reduce";

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

export async function getDevicesUnitsByVersionId(versionId: String): Promise<OptionType[]> {
    const response = await graphqlRequest(`
        query {
            deviceUnitsByVersionId(versionId: "${versionId}") {
                id
                label
            }
        }
    `);
        console.log(response)
    handleGraphQLErrors(response.errors);

    return response.data.deviceUnitsByVersionId;
}

export async function getTemporaryDeviceUnit(orderId: String): Promise<any> {
    const response = await graphqlRequest(`
        query {
            temporaryDeviceUnit(orderId: "${orderId}") {
                serial
                device {
                    id
                    brand {
                        id
                    }
                    deviceType {
                        id
                    }
                    url
                }
                deviceVersion {
                    id
                }
                device_unit_id
            }
            temporaryDeviceVersions(orderId: "${orderId}") {
                id
                version
                description
            }
            temporaryDeviceUnits(orderId: "${orderId}") {
                id
                label
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

    return {
        temporaryDeviceUnit: {
            serial: response.data.temporaryDeviceUnit.serial,
            device_unit_id: response.data.temporaryDeviceUnit.device_unit_id,
            brand_id: response.data.temporaryDeviceUnit.device.brand.id,
            type_id: response.data.temporaryDeviceUnit.device.deviceType.id,
            device_id: response.data.temporaryDeviceUnit.device.id,
            url: response.data.temporaryDeviceUnit.device.url,
            device_version_id: response.data.temporaryDeviceUnit.deviceVersion?.id
        } as temporaryDeviceUnit,
        brands: response.data.brands,
        devices: extra(response.data.devicesByBrandWithTmpOrder),
        types: response.data.deviceTypes,
        versions: deviceVersion(response.data.temporaryDeviceVersions),
        serials: response.data.temporaryDeviceUnits
    }
}
