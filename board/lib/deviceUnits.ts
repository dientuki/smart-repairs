export async function createDeviceUnit(deviceUnit: DeviceUnit): Promise<string> {
    const data = await fetch('http://localhost/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation {
                    addDeviceUnit(deviceUnit: {
                        serial: "${deviceUnit.serial}"
                        unlock_type: "${deviceUnit.unlockType}"
                        unlock_code: "${deviceUnit.unlockCode}"
                        device_id: "${deviceUnit.deviceId}"
                    }) {
                        id
                    }
                }
            `
        })
    });

    const json = await data.json();

    return json.data.addDeviceUnit.id;
}

export async function updateDeviceUnit(deviceUnit: DeviceUnit): Promise<void> {
    await fetch('http://localhost/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation {
                    updateDeviceUnit(deviceUnitId: "${deviceUnit.id}", deviceUnit: {
                        serial: "${deviceUnit.serial}"
                        unlock_type: "${deviceUnit.unlockType}"
                        unlock_code: "${deviceUnit.unlockCode}"
                        device_id: "${deviceUnit.deviceId}"
                    }) {
                        id
                    }
                }
            `
        })
    });
}
