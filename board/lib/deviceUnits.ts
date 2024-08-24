import { graphqlRequest, handleGraphQLErrors, handleUndefined, handlePayloadErrors, handleNew } from "@/helper/functions";
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

    //console.log(response.data.addTemporaryDeviceUnit)

    handleGraphQLErrors(response.errors);
    handlePayloadErrors(response.data.addTemporaryDeviceUnit);

    return response.data.addTemporaryDeviceUnit;
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
