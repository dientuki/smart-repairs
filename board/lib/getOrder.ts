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
                            phone
                        }
                        comments {
                            id
                            comment
                            created_at
                            is_public
                            user_id
                            was_edited
                            user {
                                name
                            }
                        }
                        observation
                        deviceUnit {
                            serial
                            unlock_type
                            unlock_code
                            device {
                                commercial_name
                                tech_name
                                brand {
                                    name
                                }
                                deviceType {
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
            userName: comment.user.name,
            wasEdited: comment.was_edited
        });

        return acc;

    }, []);

    return {
        $id: json.data.order.id,
        createdAt: json.data.order.created_at,
        createdAtDate: new Date(json.data.order.created_at),
        status: json.data.order.status,
        brand: json.data.order.deviceUnit.device.brand.name,
        brandImage: json.data.order.deviceUnit.device.brand.imageUrl,
        deviceType: json.data.order.deviceUnit.device.deviceType.name,
        deviceTypeImage: json.data.order.deviceUnit.device.deviceType.imageUrl,
        deviceCommercialName: json.data.order.deviceUnit.device.commercial_name,
        deviceTechName: json.data.order.deviceUnit.device.tech_name,
        deviceSerial: json.data.order.deviceUnit.serial,
        customerFullName: `${json.data.order.customer.first_name} ${json.data.order.customer.last_name}`,
        customerPhone: json.data.order.customer.phone,
        observation: json.data.order.observation,
        comments: comments
    } as Order;
}