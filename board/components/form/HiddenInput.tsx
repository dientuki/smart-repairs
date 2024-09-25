import { Input } from "@headlessui/react";
import {
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";

interface HiddenInputFieldProps {
  name: string;
  control: Control<FieldValues>;
  defaultValue?: string;
  rules?: RegisterOptions;
}

export const HiddenInput = ({
  name,
  control,
  defaultValue = "",
  rules = {},
}: HiddenInputFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => (
        <Input {...field} value={field.value} type='hidden' />
      )}
    />
  );
};
