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

export const capitalizeFirstLetter = (value: string): string => {
    if (typeof value !== 'string' || value.length === 0) return value;

    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export const handleNew = (value: string | undefined | null): string | null => {
    if (value === 'new') {
      return '';
    }
    return value ?? '';
}
