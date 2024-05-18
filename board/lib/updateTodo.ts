export const updateTodo = async (todo: Todo, columnId: TypedColumn) => {

  const data = await fetch('http://localhost/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: `
            mutation {
              updateOrderStatus(id: ${todo.$id}, status: "${columnId}")
          }
        `
    })
  });
}