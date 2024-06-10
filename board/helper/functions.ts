export const graphqlRequest = async (query: string) => {
    return await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query
        })
    });

    //return response.json();
};