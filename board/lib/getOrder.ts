export const getOrder = async (id: string) => {

    const data = await fetch('http://localhost/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                    order(id: "${id}") {
                        id
                        status
                        created_at
                        customer {
                            first_name
                            last_name
                        }
                        comments {
                            id
                            comment
                            created_at
                            is_public
                            user_id
                            user {
                                name
                            }
                        }
                        observation
                        device_unit {
                            serial
                            unlock_type
                            unlock_code
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

    const json = await data.json();

    const comments: OrderComment[] = json.data.order.comments.reduce((acc: OrderComment[], comment: any) => {
        acc.push({
            id: comment.id,
            comment: comment.comment,
            createdAt: comment.created_at,
            createdAtDate: new Date(comment.created_at),
            isPublic: comment.is_public,
            userId: comment.user_id,
            userName: comment.user.name
        });

        return acc;

    }, []);



    return {
        $id: json.data.order.id,
        createdAt: json.data.order.created_at,
        createdAtDate: new Date(json.data.order.created_at),
        status: json.data.order.status,
        brand: json.data.order.device_unit.device.brand.name,
        brandImage: json.data.order.device_unit.device.brand.imageUrl,
        deviceType: json.data.order.device_unit.device.device_type.name,
        deviceTypeImage: json.data.order.device_unit.device.device_type.imageUrl,
        deviceCommercialName: json.data.order.device_unit.device.commercial_name,
        deviceTechName: json.data.order.device_unit.device.tech_name,
        deviceSerial: json.data.order.device_unit.serial,
        customerFullName: `${json.data.order.customer.first_name} ${json.data.order.customer.last_name}`,
        observation: json.data.order.observation,
        comments: comments
    } as Order;
}