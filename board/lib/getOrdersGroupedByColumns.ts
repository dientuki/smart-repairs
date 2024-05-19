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

    const columns = orders.reduce((acc: Map<TypedColumn, Column>, todo: any ) => {

        if (!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                orders: []
            })
        }

        acc.get(todo.status)!.orders.push({
            $id: todo.id,
            createdAt: todo.created_at,
            status: todo.status,
            brand: todo.device_unit.device.brand.name,
            brandImage: todo.device_unit.device.brand.imageUrl,
            deviceType: todo.device_unit.device.device_type.name,
            deviceTypeImage: todo.device_unit.device.device_type.imageUrl,
            deviceCommercialName: todo.device_unit.device.commercial_name,
            deviceTechName: todo.device_unit.device.tech_name,
            deviceSerial: todo.device_unit.serial,
            customerFullName: `${todo.customer.first_name} ${todo.customer.last_name}`,
            observation: todo.observation,
        })

        return acc;

    }, new Map<TypedColumn, Column>());

    // if column doesn have inprogress or done or todo, create that column
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