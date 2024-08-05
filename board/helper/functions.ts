type GraphQLErrors = GraphQLError[];

type PayloadErrors = {
    status: boolean;
    message: string;
    code: string;
}

export const graphqlRequest = async (query: string, attachment?: File) => {
    let body;
    let headers = { };

    body = JSON.stringify({ query });
    headers = { 'Content-Type': 'application/json' };

    if (attachment) {
        body = new FormData();
        body.append('operations', JSON.stringify({
            query,
            attachment,
        }));

        body.append('map', JSON.stringify({ '0': ['variables.file'] }));
        body.append('0', attachment);
        headers = {};
    }

    console.log(headers, body);

    try {
        const response = await fetch('/graphql', {
            method: 'POST',
            headers,
            body,
        });

        return await response.json();
    } catch (error) {
        throw new Error('network');
    };
};

export const handleGraphQLErrors = (errors: GraphQLErrors | undefined) => {
    if (errors && errors.length > 0) {
        if (errors[0].extensions && errors[0].extensions.validation) {
            throw errors[0].extensions.validation;
        } else {
            //throw new Error(errors[0].message);
            //console.log(errors[0].message);
            throw new Error('data');
        }
    }
};

export const handlePayloadErrors = (errors: PayloadErrors) => {
    if (errors.status === false) {
        throw new Error(errors.message);
    }
};

function objectToString(object: { [key: string]: any }): string {
    return `{${Object.entries(object).map(([key, value]) => `${key}:${JSON.stringify(value)}`).join(",")}}`;
}

export const arrayToString = (array: { [key: string]: any }[]): string => {

    // Stringify the object using the replacer function
    return "[" + array.map(object => objectToString(object)).join(",") + "]";
}

export const handleUndefined = (value: string | undefined | null): string => {
    return value === undefined || value === null || value === 'undefined' ? '' : value;
}