
export const getOrder = async (id: number) => {

    const data = await fetch('http://localhost/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                    order(id: ${id}) {
                        id
                        status
                        created_at
                        customer {
                            first_name
                            last_name
                        }
                        comments {
                            comment
                        }
                        observation
                        device_unit {
                            serial
                            device {
                                commercial_name
                                tech_name
                                brand {
                                    name
                                }
                                device_type {
                                    name
                                }
                            }

                        }
                    }
              }
            `
        })
    });

    const order = await data.json();
    //console.log(order.data.order);

    return order.data.order
}