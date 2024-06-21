export const getOrdersGroupedByColumns = async () => {

    const data = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                    orders {
                        id
                        status
                        created_at
                        customer {
                            first_name
                            last_name
                        }

                        observation
                        comments {
                            id
                        }

                        deviceUnit {
                            serial
                            device {
                                commercial_name
                                tech_name
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
            `
        })
    });

    const eljson = await data.json();

    const orders = eljson.data.orders;

    const columns = orders.reduce((acc: Map<TypedColumn, Column>, order: any ) => {

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
            brand: order.deviceUnit.device.brand.name,
            brandImage: order.deviceUnit.device.brand.imageUrl,
            deviceType: order.deviceUnit.device.deviceType.name,
            deviceTypeImage: order.deviceUnit.device.deviceType.imageUrl,
            deviceCommercialName: order.deviceUnit.device.commercial_name,
            deviceTechName: order.deviceUnit.device.tech_name,
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