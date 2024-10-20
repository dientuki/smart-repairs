import { Field, Input, Label } from "@headlessui/react";
import {
  Controller,
  Control,
  FieldValues,
  FieldErrors,
  RegisterOptions,
  FieldError,
} from "react-hook-form";
import { ErrorMessage } from "@/components/form";
import { InputType, Layout } from "@/types/enums";

interface InputFieldProps {
  name: string;
  label: string;
  control: Control<FieldValues>;
  labelless?: boolean;
  disabled?: boolean;
  rules?: RegisterOptions;
  errors?: FieldErrors<FieldValues>;
  icon?: React.ReactNode;
  defaultValue?: string;
  placeholder?: string;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  type?: InputType;
  layout?: Layout;
}

const getNestedError = (
  errors: FieldErrors<FieldValues> | undefined,
  name: string,
) => {
  if (!errors) return { hasError: false, errorMessage: undefined };

  const keys = name.split(".");
  let error: FieldError | FieldErrors<FieldValues> | undefined = errors;

  for (const key of keys) {
    if (error === undefined || error === null) {
      error = undefined;
      break;
    }

    // Manejo de arrays
    if (Array.isArray(error)) {
      const index = parseInt(key, 10);
      if (isNaN(index) || index >= error.length) {
        error = undefined;
        break;
      }
      error = error[index];
    } else {
      // Manejo de objetos
      error = (
        error as {
          [key: string]: FieldError | FieldErrors<FieldValues> | undefined;
        }
      )[key];
    }
  }

  return {
    hasError: error !== undefined,
    errorMessage: (error as FieldError)?.message,
  };
};

export const InputField = ({
  name,
  label,
  labelless = false,
  control,
  rules = {},
  errors,
  icon,
  disabled = false,
  defaultValue,
  placeholder,
  onClick,
  onChange,
  type = InputType.Text,
  onBlur,
  layout = Layout.Column,
}: InputFieldProps) => {
  // Detectar si el name contiene una estructura anidada (usando un punto)
  const isNested = name.includes(".");

  // Obtener el mensaje de error adecuadamente
  const { hasError, errorMessage } = isNested
    ? getNestedError(errors, name)
    : {
        hasError: Boolean(errors?.[name]),
        errorMessage: errors?.[name]?.message,
      };

  return (
    <Field
      className={`flex ${layout === Layout.Column ? "flex-col" : "flex-row gap-4"}`}
    >
      <Label
        htmlFor={name}
        className={`${labelless ? "sr-only" : "first-letter:uppercase text-base font-medium text-gray-900"} ${
          layout === Layout.Row ? "flex items-center" : "block mb-2"
        }`}
      >
        {label}
      </Label>
      <div
        className={`flex flex-col gap-2 ${layout === Layout.Row ? "w-full" : ""}`}
      >
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
          {icon && (
            <div className='items-center gap-x-3 ps-3 flex border-e border-gray-200 pe-3 dark:border-white/10'>
              {icon}
            </div>
          )}
          <div className='min-w-0 flex-1'>
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
                  onChange={(e) => {
                    field.onChange(e);
                    if (onChange) {
                      onChange(e);
                    }
                  }}
                  onBlur={onBlur}
                  type={type}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? `${name}-error` : undefined}
                  className='block w-full border-none py-1.5 text-base text-gray-950 transition duration-75 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500  dark:text-white dark:placeholder:text-gray-500 dark:disabled:text-gray-400 bg-white/0 ps-3 pe-3'
                />
              )}
            />
          </div>
        </div>
        <ErrorMessage message={errorMessage} />
      </div>
    </Field>
  );
};
