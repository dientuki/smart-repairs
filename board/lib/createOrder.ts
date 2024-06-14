export const getCustomersDevices = async (tenantId: string) => {

  //01HZJ9PYBNDCMQYHGCXMFHBFK3

  const data = await fetch('/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: `
            query {
              customers {
                id
                fullName
                first_name
                last_name
                phone
                email
              }
              devices {
                id
                commercial_name
                tech_name
                url
                brand {
                    name
                }
                device_type {
                    name
                }
              }
              devicesRepared(team_id:"01HZRBD546A6AE8CP91AEP1N64") {
                id
                serial
                device {
                    id
                    commercial_name
                    brand {
                      name
                    }
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
        `
    })
  });

  const json = await data.json();

  const customers: Customer[] = json.data.customers.reduce((acc: Customer[], customer: any) => {
    acc.push({
        id: customer.id,
        label: customer.fullName,
        firstname: customer.first_name,
        lastname: customer.last_name,
        email: customer.email,
        phone: customer.phone,
    });

    return acc;

  }, []);

  const devices: Device[] = json.data.devices.reduce((acc: Device[], device: any) => {
    acc.push({
        id: device.id,
        label: `${device.brand.name} ${device.commercial_name}`,
        commercialName: device.commercial_name,
        techName: device.tech_name,
        brand: device.brand.name,
        type: device.device_type.name,
        url: device.url
    });

    return acc;

  }, []);

  const devicesRepared: DeviceRepared[] = json.data.devicesRepared.reduce((acc: DeviceRepared[], device: any) => {
    acc.push({
        id: device.id,
        label: `${device.device.brand.name} ${device.device.commercial_name} - ${device.serial}`,
        deviceId: device.device.id,
        serial: device.serial,

    });

    return acc;

  }, []);

  return {
    customers: customers,
    devices: devices,
    devicesRepared: devicesRepared,
    brands: json.data.brands,
    deviceTypes: json.data.deviceTypes
  }
};