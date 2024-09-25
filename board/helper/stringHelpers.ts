function objectToString(object: { [key: string]: any }): string {
  return Object.entries(object)
    .map(([key, value]) => {
      // Si el valor es un número o booleano, no lo envuelve en comillas
      if (typeof value === "number" || typeof value === "boolean") {
        return `${key}:${value}`;
      }
      if (typeof value === "string") {
        value = value.replace(/\\/g, '\\\\'); // Escapa las barras invertidas
      }
      // Si el valor es un string, lo envuelve en comillas
      return `${key}:"${value.replace(/"/g, '\\"')}"`; // Escapa comillas dentro de strings
    })
    .join(",");
}

export const arrayToString = (array: { [key: string]: any }[]): string => {
  // Genera el array como string usando la función objectToString
  return "[" + array.map((object) => `{${objectToString(object)}}`).join(",") + "]";
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
