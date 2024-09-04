
// Function to clean classes by removing the last part after the last dash
const cleanClass = (cls: string) => {
  const lastDashIndex = cls.lastIndexOf('-');
  return lastDashIndex !== -1 ? cls.slice(0, lastDashIndex) : cls;
};

// Function to combine classes, giving priority to custom classes
export const combineClasses = (defaultClasses: string, customClasses: string) => {
  const defaultClassList = defaultClasses.split(' ');
  const customClassList = customClasses.split(' ');

  // Clean custom classes to compare without considering numbers
  const cleanedCustomClasses = new Set(customClassList.map(cleanClass));

  // Filter default classes that are not in custom classes
  const filteredDefaultClasses = defaultClassList.filter(
    (cls) => !cleanedCustomClasses.has(cleanClass(cls))
  );

  // Combine custom classes with filtered default classes
  return [...customClassList, ...filteredDefaultClasses].join(' ');
};