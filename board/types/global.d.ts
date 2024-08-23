interface OptionType {
  id: string;
  label: string;
  info?: string | null | {
    [key: string]: string | null;
  };
}