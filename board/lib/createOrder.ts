export const getCustomersDevices = async (tenantId: string) => {

  //01HZJ9PYBNDCMQYHGCXMFHBFK3

  const data = await fetch('http://localhost/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: `
            query {
              customers(team_id:"01HZJ9PYBNDCMQYHGCXMFHBFK3") {
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
                }
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
        firstName: customer.first_name,
        lastName: customer.last_name,
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

  return {
    customers: customers,
    devices: devices,
    devicesUnit: 'devicesUnit'
  }
};