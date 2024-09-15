type DefaultState = Record<string, any>;

export const clearState = (
  keys: string | string[],
  defaultState: DefaultState,
  set: (partial: Partial<DefaultState>) => void,
) => {
  if (typeof keys === "string") {
    set({ [keys]: defaultState[keys] });
  } else if (Array.isArray(keys)) {
    const newState = keys.reduce(
      (acc, key) => {
        acc[key] = defaultState[key];
        return acc;
      },
      {} as Record<string, any>,
    );
    set(newState);
  }
};
