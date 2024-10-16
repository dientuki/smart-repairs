export const simpleError = (e: unknown) => {
  return e instanceof Error ? e.message : "generic";
};
