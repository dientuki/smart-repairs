export const getOrdersGroupedByColumns = async () => {

    const data = await fetch('http://localhost/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                    orders(team_id:1) {
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

                        device_unit {
                            serial
                            device {
                                commercial_name
                                tech_name
                            brand {
                                name
                                imageUrl
                            }
                            device_type {
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
            brand: order.device_unit.device.brand.name,
            brandImage: order.device_unit.device.brand.imageUrl,
            deviceType: order.device_unit.device.device_type.name,
            deviceTypeImage: order.device_unit.device.device_type.imageUrl,
            deviceCommercialName: order.device_unit.device.commercial_name,
            deviceTechName: order.device_unit.device.tech_name,
            deviceSerial: order.device_unit.serial,
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