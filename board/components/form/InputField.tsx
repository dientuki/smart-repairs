import React from 'react';
import { Controller, Control, FieldValues, FieldErrors, RegisterOptions } from 'react-hook-form';

interface InputFieldProps {
  name: string;
  label: string;
  control: Control<FieldValues>;
  rules?: RegisterOptions;
  errors?: FieldErrors<FieldValues>;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  defaultValue?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  control,
  rules = {},
  errors,
  icon: Icon,
  defaultValue = '',
}) => {
  return (
    <div className="field">
      <label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className={Icon ? 'flex' : ''}>
        {Icon && (
          <div className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md">
            <Icon className="w-4 h-4 text-gray-500" aria-hidden="true" />
          </div>
        )}
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          rules={rules}
          render={({ field }) => (
            <input
              {...field}
              className={`${Icon ? 'rounded-none rounded-e-lg' : 'rounded-lg'} bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 p-2.5 ${
                errors?.[name] ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500' : ''
              }`}
            />
          )}
        />
      </div>
      {errors?.[name]?.message && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          {typeof errors[name].message === 'string' ? errors[name].message : JSON.stringify(errors[name].message)}
        </p>
      )}
    </div>
  );
};

export default InputField;
