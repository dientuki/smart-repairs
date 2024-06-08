export const createDevice = async(device: NewDevice) => {

    const data = await fetch('http://localhost/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation {
                    addDevice(device: {
                        type: "${device.type}"
                        brand: "${device.brand}"
                        commercialName: "${device.commercialName}"
                        techName: "${device.techName}"
                        url: "${device.url}"
                    }) {
                        id
                    }
                }
            `
        })
    });

    const json = await data.json();

    return json.data.addDevice.id;
}

export const updateDevice = async(device: NewDevice) => {
    await fetch('http://localhost/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation {
                    updateDevice(deviceId: "${device.id}", device: {
                        type: "${device.type}"
                        brand: "${device.brand}"
                        commercialName: "${device.commercialName}"
                        techName: "${device.techName}"
                        url: "${device.url}"
                    }) {
                        id
                    }
                }
            `
        })
    });
}