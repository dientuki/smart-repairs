import { Field, Label } from "@headlessui/react";
import { Autocomplete, TextField, Skeleton } from '@mui/material';
import { Controller, Control, FieldValues, RegisterOptions, FieldErrors } from 'react-hook-form';
import ErrorMessage from "./ErrorMessage";

// Define el tipo para las opciones del Autocomplete
interface OptionType {
  id: string;
  label: string;
}

interface ValidatedAutocompleteProps {
  name: string;
  control: Control<FieldValues>;
  rules?: RegisterOptions;
  options: OptionType[] | boolean;
  onChange?: (event: React.SyntheticEvent, newValue: OptionType | null, reason?: string) => void;
  label: string;
  value?: any,
  isLoading: boolean;
  errors?: FieldErrors<FieldValues>;
  disableClearable?: boolean;
  filterOptions?: (options: any, params: any) => OptionType[];
}

// Componente ValidatedAutocomplete
const ValidatedAutocomplete: React.FC<ValidatedAutocompleteProps> = ({
  name,
  control,
  options,
  rules,
  onChange,
  label,
  isLoading,
  disableClearable = false,
  filterOptions,
  value,
  errors }) => {
  return (
    <Field>
      <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{label}</Label>
      {isLoading ? (
        <Skeleton variant="rectangular" width={210} height={32} />
      ) : (
        <Controller
          name={name}
          control={control}
          defaultValue=""
          rules={rules}
          render={({ field }) => (
            <Autocomplete
              onChange={onChange}
              filterOptions={filterOptions}
              selectOnFocus
              handleHomeEndKeys
              value={value}
              options={options}
              disableClearable={disableClearable}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              )}
            />
          )}
        />
      )}
      <ErrorMessage message={errors?.[name]?.message} />
    </Field>
  );
};

export default ValidatedAutocomplete;
