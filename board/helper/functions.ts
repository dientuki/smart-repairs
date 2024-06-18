type GraphQLErrors = GraphQLError[];

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

export const handleGraphQLErrors = (errors: GraphQLErrors | undefined) => {
    if (errors && errors.length > 0) {
        if (errors[0].extensions && errors[0].extensions.validation) {
            throw errors[0].extensions.validation;
        } else {
            throw new Error(errors[0].message);
        }
    }
};

function objectToString(obj) {
    return `{${Object.entries(obj).map(([key, value]) => `${key}:${JSON.stringify(value)}`).join(",")}}`;
}

export const arrayToString = (arr) => {

    // Stringify the object using the replacer function
    return "[" + arr.map(obj => objectToString(obj)).join(",") + "]";
}