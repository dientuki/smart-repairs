import { graphqlRequest, handleGraphQLErrors, handleUndefined, handlePayloadErrors } from "@/helper/functions";

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
                }
                deviceVersion {
                    version
                    description
                }
                device_unit_id
            }
            temporaryVersions(orderId: "${orderId}") {
                deviceVersions {
                    id
                    name
                }
            }
            devices {
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

    console.log(response);

    handleGraphQLErrors(response.errors);

    const devices: Device[] = response.data.devices.reduce((acc: Device[], device: any) => {
        acc.push({
            id: device.id,
            label: `${device.brand.name} ${device.commercial_name}`,
            commercialname: device.commercial_name,
            brand: device.brand.name,
            type: device.deviceType.name,
            url: device.url
        });

        return acc;

      }, []);

    return {
        temporaryDeviceUnit: {
            serial: response.data.temporaryDeviceUnit.serial,
            device_unit_id: response.data.temporaryDeviceUnit.device_unit_id,
            deviceBrand: response.data.temporaryDeviceUnit.device.brand.name,
            deviceType: response.data.temporaryDeviceUnit.device.deviceType.name,
            commercialName: response.data.temporaryDeviceUnit.device.commercial_name,
        } as temporaryDeviceUnit,
        devices: devices,
        brands: response.data.brands,
        deviceTypes: response.data.deviceTypes,
    }
}
