export const updateStatus = async (taskId: string, columnId: TypedColumn) => {

  const data = await fetch('http://localhost/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: `
            mutation {
              updateOrderStatus(id: "${taskId}", status: "${columnId}")
          }
        `
    })
  });
}