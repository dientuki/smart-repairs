export const graphqlRequest = async (query: string) => {
    try {
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query
            })
        });

        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch data');
    };
};