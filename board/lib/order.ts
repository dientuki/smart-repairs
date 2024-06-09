export const createOrder = async (newOrder: NewOrder) => {
    console.log(newOrder)
    await fetch('http://localhost/graphql', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                query: `
                        mutation {
                            addOrder(order: {
                                customer_id: "${newOrder.customerId}"
                                device_unit_id: "${newOrder.deviceUnitId}"
                                observation: "${newOrder.observation}"
                            }) {
                                id
                            }
                    }
                `
        })
    });
}