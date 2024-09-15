import { Field, Input, Label } from "@headlessui/react";
import {
  Controller,
  Control,
  FieldValues,
  FieldErrors,
  RegisterOptions,
} from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

interface InputFieldProps {
  name: string;
  label: string;
  control: Control<FieldValues>;
  labelless?: boolean;
  disabled?: boolean;
  rules?: RegisterOptions;
  errors?: FieldErrors<FieldValues>;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  defaultValue?: string;
  placeholder?: string;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
}

export const InputField = ({
  name,
  label,
  labelless = false,
  control,
  rules = {},
  errors,
  icon: Icon,
  disabled = false,
  defaultValue = "",
  placeholder,
  onClick,
}: InputFieldProps) => {
  const hasError = Boolean(errors?.[name]);

  return (
    <Field>
      <Label
        className={
          labelless
            ? "sr-only"
            : "first-letter:uppercase block mb-2 text-base font-medium text-gray-900"
        }
      >
        {label}
      </Label>
      <div className={Icon ? "flex" : ""}>
        {Icon && (
          <div className='inline-flex items-center px-3 text-base text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md'>
            <Icon className='w-4 h-4 text-gray-500' aria-hidden='true' />
          </div>
        )}
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue || ""}
          rules={rules}
          render={({ field }) => (
            <Input
              {...field}
              readOnly={disabled}
              placeholder={placeholder}
              onClick={(e) => {
                onClick?.(e); // Llamar al evento custom si se pasa
              }}
              className={`${Icon ? "rounded-none rounded-e-lg" : "rounded-lg"} bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full text-base border-gray-300 p-2.5 ${
                hasError
                  ? "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500"
                  : ""
              }`}
            />
          )}
        />
      </div>
      <ErrorMessage message={errors?.[name]?.message} />
    </Field>
  );
};
