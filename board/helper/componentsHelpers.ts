import { StyleColor } from "@/types/enums";

// Function to clean classes by removing the last part after the last dash
const cleanClass = (cls: string) => {
  const lastDashIndex = cls.lastIndexOf("-");
  return lastDashIndex !== -1 ? cls.slice(0, lastDashIndex) : cls;
};

// Function to combine classes, giving priority to custom classes
export const combineClasses = (
  defaultClasses: string,
  customClasses: string,
) => {
  const defaultClassList = defaultClasses.split(" ");
  const customClassList = customClasses.split(" ");

  // Clean custom classes to compare without considering numbers
  const cleanedCustomClasses = new Set(customClassList.map(cleanClass));

  // Filter default classes that are not in custom classes
  let filteredDefaultClasses = defaultClassList.filter(
    (cls) => !cleanedCustomClasses.has(cleanClass(cls)),
  );

  if (cleanedCustomClasses.has("absolute")) {
    filteredDefaultClasses = filteredDefaultClasses.filter(
      (cls) => cls !== "relative",
    );
  }

  // Combine custom classes with filtered default classes
  return [...customClassList, ...filteredDefaultClasses].join(" ");
};

export const dynamicStyles = (
  style: StyleColor,
): React.CSSProperties & Record<string, string> => {
  const keys = ["50", "100", "400", "500", "600"];

  return keys.reduce(
    (acc, key) => {
      acc[`--c-${key}`] = `var(--${style}-${key})`;
      return acc;
    },
    {} as Record<string, string>,
  );
};

export const upsertOptionType = (
  original: OptionType[],
  upsertItem: OptionType,
): OptionType[] => {
  const index = original.findIndex((item) => item.id === upsertItem.id);

  if (index === -1) {
    // Si no existe, agregamos el nuevo elemento
    return [...original, upsertItem];
  } else {
    // Si ya existe, actualizamos el elemento
    const updatedOriginal = [...original];
    updatedOriginal[index] = upsertItem;
    return updatedOriginal;
  }
};
