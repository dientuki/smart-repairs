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
                        device_type_id: "${device.type}"
                        brand_id: "${device.brand}"
                        commercial_name: "${device.commercialName}"
                        tech_name: "${device.techName}"
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
                        device_type_id: "${device.type}"
                        brand_id: "${device.brand}"
                        commercial_name: "${device.commercialName}"
                        tech_name: "${device.techName}"
                        url: "${device.url}"
                    }) {
                        id
                    }
                }
            `
        })
    });
}