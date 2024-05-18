export const getTodosGroupedByColumns = async () => {

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

    const eljson = await data.json();

    const todos = eljson.data.orders;

    const columns = todos.reduce((acc: Map<TypedColumn, Column>, todo: any ) => {

        if (!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                todos: []
            })
        }

        acc.get(todo.status)!.todos.push({
            $id: todo.id,
            $createdAt: todo.created_at,
            title: todo.customer.first_name,
            status: todo.status,
        })

        return acc;

    }, new Map<TypedColumn, Column>());

    // if column doesn have inprogress or done or todo, create that column
    const columnTypes: TypedColumn[] = ["for budgeting", "budgeting", "budgeted", "to do", "repairing", "repaired"];
    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: []
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