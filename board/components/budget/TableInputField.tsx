import { Field, Input } from "@headlessui/react";
import React from 'react';
import { Controller, Control, FieldValues, FieldErrors, RegisterOptions } from 'react-hook-form';

interface InputFieldProps {
  name: string;
  label: string;
  control: Control<FieldValues>;
  disabled?: boolean;
  rules?: RegisterOptions;
  errors?: FieldErrors<FieldValues>;
  defaultValue?: string;
}

const TableInputField: React.FC<InputFieldProps> = ({
  name,
  control,
  rules = {},
  errors,
  disabled = false,
  defaultValue = '',
}) => {
  return (
    <Field>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          rules={rules}
          render={({ field }) => (
            <Input
              {...field}
              readOnly={disabled}
              className={`rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 p-2.5 ${
                errors?.[name] ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500' : ''
              }`}
            />
          )}
        />
    </Field>
  );
};

export default TableInputField;
