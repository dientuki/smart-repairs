import { Field, Label, Textarea } from "@headlessui/react";
import {
  Controller,
  Control,
  FieldValues,
  FieldErrors,
  RegisterOptions,
} from "react-hook-form";
import { ErrorMessage } from "@/components/form";

interface TextareaFieldProps {
  name: string;
  label: string;
  control: Control<FieldValues>;
  labelless?: boolean;
  disabled?: boolean;
  rules?: RegisterOptions;
  errors?: FieldErrors<FieldValues>;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  onClick?: (event: React.MouseEvent<HTMLTextAreaElement>) => void;
}

export const TextareaField = ({
  name,
  label,
  labelless = false,
  control,
  rules = {},
  errors,
  disabled = false,
  defaultValue = "",
  placeholder,
  rows = 3,
  onClick,
}: TextareaFieldProps) => {
  const hasError = Boolean(errors?.[name]);
  //const minHeight = `calc(${lineHeight} * ${rows} + ${paddingVertical} * 2)`;

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
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || ""}
            rules={rules}
            render={({ field }) => (
              <Textarea
                {...field}
                id={name}
                rows={rows}
                readOnly={disabled}
                placeholder={placeholder}
                onClick={onClick}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${name}-error` : undefined}
                className='block w-full border-none bg-transparent px-3 py-1.5 text-base text-gray-950 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500 disabled:[-webkit-text-fill-color:theme(colors.gray.500)] disabled:placeholder:[-webkit-text-fill-color:theme(colors.gray.400)] dark:text-white dark:placeholder:text-gray-500 dark:disabled:text-gray-400 dark:disabled:[-webkit-text-fill-color:theme(colors.gray.400)] dark:disabled:placeholder:[-webkit-text-fill-color:theme(colors.gray.500)] sm:text-sm sm:leading-6'
              />
            )}
          />
        </div>
        <ErrorMessage message={errors?.[name]?.message} />
      </div>
    </Field>
  );
};
