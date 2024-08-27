import { graphqlRequest, handleGraphQLErrors, handlePayloadErrors } from "@/helper/graphqlHelpers";
import { deviceVersion, extra } from "@/helper/reduceHelpers";
import { handleNew, handleUndefined } from "@/helper/stringHelpers";

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

export async function addTemporaryDeviceUnit(data: TemporaryDeviceUnitInput): Promise<any> {

    const response = await graphqlRequest(`
        mutation {
            addTemporaryDeviceUnit(input: {
                deviceid: "${handleNew(data.deviceid)}"

                brandid: "${handleNew(data.brandid)}"
                brandlabel: "${data.brandlabel}"
                typeid: "${handleNew(data.typeid)}"
                typelabel: "${data.typelabel}"
                commercialname: "${data.commercialname}"
                url: "${handleUndefined(data.url)}"

                unlocktype: "${data.unlocktype}"
                unlockcode: "${handleUndefined(data.unlockcode)}"
                serialid: "${handleNew(data.serialid)}"
                seriallabel: "${handleUndefined(data.seriallabel)}"
                versionid: "${handleNew(data.versionid)}"
                versionlabel: "${handleUndefined(data.versionlabel)}"
            }) {
                __typename
                ... on TemporaryDeviceUnitPayload {
                    temporarydeviceunit
                    status
                    brand {
                        id
                        label
                    }
                    deviceType {
                        id
                        label
                    }
                    device {
                        id
                        commercial_name
                        url
                        brand {
                            id
                            name
                        }
                        deviceType {
                            id
                            name
                        }
                    }
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
    handlePayloadErrors(response.data.addTemporaryDeviceUnit);

    return response.data.addTemporaryDeviceUnit;
}

export async function getDevicesUnitsByVersionId(versionId: string): Promise<OptionType[]> {
    const response = await graphqlRequest(`
        query {
            deviceUnitsByVersionId(versionId: "${versionId}") {
                id
                label
            }
        }
    `);

    handleGraphQLErrors(response.errors);

    return response.data.deviceUnitsByVersionId;
}

export async function getDeviceUnitUpdate(deviceUnit: string): Promise<any> {
    const response = await graphqlRequest(`
        query {
            deviceUnit(deviceUnitId: "${deviceUnit}") {
                id
                serial
                deviceVersion {
                    id
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
                }
            }
            deviceUnitsByDeviceUnit(deviceUnitId: "${deviceUnit}") {
                id
                label
            }
            devicesByDeviceUnit(deviceUnitId: "${deviceUnit}") {
                id
                label
                url
            }
            deviceVersionsByDeviceUnit(deviceUnitId: "${deviceUnit}") {
                id
                version
                description
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
        deviceUnit: {
            serial: response.data.deviceUnit.serial,
            device_unit_id: response.data.deviceUnit.id,
            brand_id: response.data.deviceUnit.deviceVersion.device.brand.id,
            type_id: response.data.deviceUnit.deviceVersion.device.deviceType.id,
            device_id: response.data.deviceUnit.deviceVersion.device.id,
            url: response.data.deviceUnit.deviceVersion.device.url,
            device_version_id: response.data.deviceUnit.deviceVersion?.id
        },
        brands: response.data.brands,
        types: response.data.deviceTypes,
        devices: extra(response.data.devicesByDeviceUnit),
        versions: deviceVersion(response.data.deviceVersionsByDeviceUnit),
        serials: response.data.deviceUnitsByDeviceUnit
    }
}

export async function getTemporaryDeviceUnit(orderId: string): Promise<any> {
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
            devicesByBrandWithTmpOrder(orderId: "${orderId}") {
                id
                label
                url
            }
            temporaryDeviceUnits(orderId: "${orderId}") {
                id
                label
            }
            temporaryDeviceVersions(orderId: "${orderId}") {
                id
                version
                description
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
        deviceUnit: {
            serial: response.data.temporaryDeviceUnit.serial,
            device_unit_id: response.data.temporaryDeviceUnit.device_unit_id,
            brand_id: response.data.temporaryDeviceUnit.device.brand.id,
            type_id: response.data.temporaryDeviceUnit.device.deviceType.id,
            device_id: response.data.temporaryDeviceUnit.device.id,
            url: response.data.temporaryDeviceUnit.device.url,
            device_version_id: response.data.temporaryDeviceUnit.deviceVersion?.id
        },
        brands: response.data.brands,
        types: response.data.deviceTypes,
        devices: extra(response.data.devicesByBrandWithTmpOrder),
        versions: deviceVersion(response.data.temporaryDeviceVersions),
        serials: response.data.temporaryDeviceUnits
    }
}

export async function confirmDeviceUnit(data: any): Promise<any> {
    const response = await graphqlRequest(`
        mutation {
            confirmDeviceUnit(input: {
                order: "${data.order}",
                brandid: "${handleNew(data.brandid)}",
                brandlabel: "${data.brandlabel}",
                deviceid: "${handleNew(data.deviceid)}",
                devicelabel: "${data.devicelabel}",
                serialid: "${handleNew(data.serialid)}",
                seriallabel: "${data.seriallabel}",
                typeid: "${handleNew(data.typeid)}",
                typelabel: "${data.typelabel}",
                url: "${handleUndefined(data.url)}",
                versionid: "${handleNew(data.versionid)}",
                versionlabel: "${data.versionlabel}",
                deviceunitid: "${handleUndefined(data.deviceunitid)}"
            })
        }`);

    handleGraphQLErrors(response.errors);

    return response.data.confirmDeviceUnit
}