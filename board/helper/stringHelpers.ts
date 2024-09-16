function objectToString(object: { [key: string]: any }): string {
  return `{${Object.entries(object)
    .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
    .join(",")}}`;
}

export const arrayToString = (array: { [key: string]: any }[]): string => {
  // Stringify the object using the replacer function
  return "[" + array.map((object) => objectToString(object)).join(",") + "]";
};

export const handleUndefined = (value: string | undefined | null): string => {
  return value === undefined || value === null || value === "undefined"
    ? ""
    : value;
};

export const capitalizeFirstLetter = (
  value: string | null,
): string | undefined => {
  if (typeof value !== "string") return undefined;

  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const handleNew = (value: string | undefined | null): string | null => {
  if (value === "new") {
    return "";
  }
  return value ?? "";
};

export const escapeGraphQLString = (str: string) => {
  return str
    .replace(/\\/g, "\\\\") // Escapa los backslashes
    .replace(/"/g, '\\"')   // Escapa las comillas dobles
    .replace(/\n/g, "\\n");  // Escapa los saltos de línea
};
