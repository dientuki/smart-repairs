import { Field, Label } from "@headlessui/react";
import { Autocomplete, TextField, Skeleton, createFilterOptions } from '@mui/material';
import { Controller, Control, FieldValues, RegisterOptions, FieldErrors } from 'react-hook-form';
import ErrorMessage from "./ErrorMessage";

// Define el tipo para las opciones del Autocomplete

const filter = createFilterOptions<OptionType>();

interface ValidatedAutocompleteProps {
  name: string;
  control: Control<FieldValues>;
  rules?: RegisterOptions;
  options: OptionType[] | boolean;
  onChange?: (event: React.SyntheticEvent, newValue: OptionType | null, reason?: string) => void;
  label: string;
  value?: OptionType | null,
  isLoading: boolean;
  errors?: FieldErrors<FieldValues>;
  disableClearable?: boolean;
  disabled?: boolean;
  filterOptions?: (options: any, params: any) => OptionType[];
  key?: any;
}

const defaultFilterOptions = (options: OptionType[], params: any) => {
  const filtered = filter(options, params);

  const { inputValue } = params;
  // Suggest the creation of a new value
  const isExisting = options.some((option: OptionType) => inputValue === option.label);
  if (inputValue !== '' && !isExisting) {
    filtered.push({
      id: 'new',
      label: inputValue,
    });
  }

  return filtered;
};

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
  filterOptions = defaultFilterOptions,
  value,
  disabled = false,
  key,
  errors }) => {
  return (
    <Field>
      <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{label}</Label>
      {isLoading && !disabled ? (
        <Skeleton variant="rectangular" height={40} />
      ) : (
        <Controller
          name={name}
          control={control}
          defaultValue=""
          rules={rules}
          render={() => (
            <Autocomplete
              onChange={onChange}
              filterOptions={filterOptions}
              selectOnFocus
              handleHomeEndKeys
              clearOnEscape
              value={value}
              options={Array.isArray(options) ? options : []}
              disableClearable={disableClearable}
              isOptionEqualToValue={() => true}
              disabled={disabled}
              key={key}
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
