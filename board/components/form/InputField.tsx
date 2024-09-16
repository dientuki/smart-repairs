import { Field, Input, Label } from "@headlessui/react";
import {
  Controller,
  Control,
  FieldValues,
  FieldErrors,
  RegisterOptions,
} from "react-hook-form";
import { ErrorMessage } from "@/components/form";

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
        htmlFor={name}
        className={
          labelless
            ? "sr-only"
            : "first-letter:uppercase block mb-2 text-base font-medium text-gray-900"
        }
      >
        {label}
      </Label>
      <div className='flex flex-col gap-2'>
        <div
          className={`flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5
              [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2
              ${
                hasError
                  ? "ring-danger-600 dark:ring-danger-500 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-danger-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-danger-500"
                  : "ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500"
              }
              overflow-hidden`}
        >
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
                id={name}
                readOnly={disabled}
                placeholder={placeholder}
                onClick={onClick}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${name}-error` : undefined}
                className='block w-full border-none py-1.5 text-base text-gray-950 transition duration-75 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500 disabled:[-webkit-text-fill-color:theme(colors.gray.500)] disabled:placeholder:[-webkit-text-fill-color:theme(colors.gray.400)] dark:text-white dark:placeholder:text-gray-500 dark:disabled:text-gray-400 dark:disabled:[-webkit-text-fill-color:theme(colors.gray.400)] dark:disabled:placeholder:[-webkit-text-fill-color:theme(colors.gray.500)]  bg-white/0 ps-3 pe-3'
              />
            )}
          />
        </div>
        <ErrorMessage message={errors?.[name]?.message} />
      </div>
    </Field>
  );
};
