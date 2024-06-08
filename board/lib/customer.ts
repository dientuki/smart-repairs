export const createCustomer = async(customer: Customer) => {

    const data = await fetch('http://localhost/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation {
                    addCustomer(customer: {
                        first_name: "${customer.firstName}"
                        last_name: "${customer.lastName}"
                        phone: "${customer.phone}"
                        email: "${customer.email}"
                    }) {
                        id
                    }
                }
            `
        })
    });

    const json = await data.json();

    return json.data.addCustomer.id;
}

export const updateCustomer = async(customer: Customer) => {
    await fetch('http://localhost/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation {
                    updateCustomer(customerId: "${customer.id}", customer: {
                        first_name: "${customer.firstName}"
                        last_name: "${customer.lastName}"
                        phone: "${customer.phone}"
                        email: "${customer.email}"
                    }) {
                        id
                    }
                }
            `
        })
    });
}