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

  return {
    customers: customers,
    devices: 'devices',
    devicesUnit: 'devicesUnit'
  }
};