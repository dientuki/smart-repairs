import { graphqlRequest, arrayToString, handleGraphQLErrors } from "@/helper/functions";

export const createOrder = async (newOrder: NewOrder) => {

    const response = await graphqlRequest(`
                        mutation {
                            addOrder(order: {
                                customer_id: "${newOrder.customerId}"
                                device_unit_id: "${newOrder.deviceUnitId}"
                                observation: "${newOrder.observation}"
                                damages: ${arrayToString(newOrder.damages)}
                                damage_description: "${newOrder.damageDescription}"
                                features: ${arrayToString(newOrder.features)}
                                feature_description: "${newOrder.featureDescription}"
                            })
                    }
                `);

    handleGraphQLErrors(response.errors);

    return response.data.addOrder;

}

export const getOrder = async (id: string) => {

    const response = await graphqlRequest(`
        query {
            order(id: "${id}") {
                id
                status
                created_at
                observation

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
                deviceUnit {
                    serial
                    unlock_type
                    unlock_code
                    deviceVersion {
                        version
                        device {
                            commercial_name
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
        }
    `);

    handleGraphQLErrors(response.errors);

    const comments: OrderComment[] = response.data.order.comments.reduce((acc: OrderComment[], comment: any) => {
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
        $id: response.data.order.id,
        createdAt: response.data.order.created_at,
        createdAtDate: new Date(response.data.order.created_at),
        status: response.data.order.status,
        brand: response.data.order.deviceUnit.deviceVersion.device.brand.name,
        brandImage: response.data.order.deviceUnit.deviceVersion.device.brand.imageUrl,
        deviceType: response.data.order.deviceUnit.deviceVersion.device.deviceType.name,
        deviceTypeImage: response.data.order.deviceUnit.deviceVersion.device.deviceType.imageUrl,
        deviceCommercialName: response.data.order.deviceUnit.deviceVersion.device.commercial_name,
        deviceSerial: response.data.order.deviceUnit.deviceVersion.serial,
        customerFullName: `${response.data.order.customer.first_name} ${response.data.order.customer.last_name}`,
        customerPhone: response.data.order.customer.phone,
        observation: response.data.order.observation,
        comments: comments
    } as Order;

}

export const getOrders = async () => {
    const response = await graphqlRequest(`
        query {
            orders {
                id
                status
                created_at
                observation

                customer {
                    first_name
                    last_name
                }
                comments {
                    id
                }

                deviceUnit {
                    serial
                    deviceVersion {
                        version
                        device {
                            commercial_name
                            brand {
                                name
                                imageUrl
                            }
                            deviceType {
                                name
                                imageUrl
                            }
                        }
                    }
                }
            }
        }
    `);

    handleGraphQLErrors(response.errors);

    const columns = response.data.orders.reduce((acc: Map<TypedColumn, Column>, order: any ) => {

        if (!acc.get(order.status)) {
            acc.set(order.status, {
                id: order.status,
                orders: []
            })
        }

        acc.get(order.status)!.orders.push({
            $id: order.id,
            createdAt: order.created_at,
            createdAtDate: new Date(order.created_at),
            status: order.status,
            brand: order.deviceUnit.deviceVersion.device.brand.name,
            brandImage: order.deviceUnit.deviceVersion.device.brand.imageUrl,
            deviceType: order.deviceUnit.deviceVersion.device.deviceType.name,
            deviceTypeImage: order.deviceUnit.deviceVersion.device.deviceType.imageUrl,
            deviceCommercialName: order.deviceUnit.deviceVersion.device.commercial_name,
            deviceTechName: order.deviceUnit.deviceVersion.version,
            deviceSerial: order.deviceUnit.serial,
            customerFullName: `${order.customer.first_name} ${order.customer.last_name}`,
            observation: order.observation,
            commentsQuantity: order.comments?.length
        })

        return acc;

    }, new Map<TypedColumn, Column>());

    // if column doesn have inprogress or done or order, create that column
    const columnTypes: TypedColumn[] = ["for budgeting", "budgeting", "budgeted", "to do", "repairing", "repaired"];
    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                orders: []
            })
        }
    }

    const sortedColumns = new Map(
        Array.from(columns.entries()).sort(
            (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        )
    )

    const board: Board = {
        columns: sortedColumns
    }

    return board;
}
