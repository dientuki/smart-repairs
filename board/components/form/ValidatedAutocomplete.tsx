import { Field, Label } from "@headlessui/react";
import {
  Autocomplete,
  TextField,
  Skeleton,
  createFilterOptions,
  FilterOptionsState,
} from "@mui/material";
import {
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
  FieldErrors,
} from "react-hook-form";
import { ErrorMessage } from "@/components/form";

const filter = createFilterOptions<OptionType>();

interface ValidatedAutocompleteProps {
  name: string;
  control: Control<FieldValues>;
  label: string;
  isLoading?: boolean;
  options: OptionType[] | [];

  rules?: RegisterOptions;
  errors?: FieldErrors<FieldValues>;
  value?: OptionType | null;
  disableClearable?: boolean;
  disabled?: boolean;

  onChange?: (
    event: React.SyntheticEvent,
    newValue: OptionType | null,
    reason?: string,
  ) => void;

  filterOptions?: (
    options: OptionType[],
    state: FilterOptionsState<OptionType>,
  ) => OptionType[];
}

const defaultFilterOptions = (
  options: OptionType[],
  params: FilterOptionsState<OptionType>,
) => {
  const filtered = filter(options, params);

  const { inputValue } = params;
  // Suggest the creation of a new value
  const isExisting = options.some(
    (option: OptionType) => inputValue === option.label,
  );
  if (inputValue !== "" && !isExisting) {
    filtered.push({
      id: "new",
      label: inputValue,
    });
  }

  return filtered;
};

// Componente ValidatedAutocomplete
export const ValidatedAutocomplete = ({
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
  errors,
}: ValidatedAutocompleteProps) => {
  const hasError = Boolean(errors?.[name]);

  return (
    <Field>
      <Label className='first-letter:uppercase block mb-2 text-base font-medium text-gray-900'>
        {label}
      </Label>
      {isLoading && !disabled ? (
        <Skeleton variant='rectangular' height={40} />
      ) : (
        <div
          className={`w-full rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 [&:not(:has(.fi-ac-action:focus))]:focus-within overflow-hidden
          ${
            hasError
              ? "ring-danger-600 dark:ring-danger-500 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-danger-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-danger-500"
              : "ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500"
          }`}
        >
          <Controller
            name={name}
            control={control}
            defaultValue=''
            rules={rules}
            render={() => (
              <Autocomplete
                autoHighlight
                autoSelect
                selectOnFocus
                handleHomeEndKeys
                clearOnEscape
                id={name}
                onChange={onChange}
                filterOptions={filterOptions}
                value={value}
                options={Array.isArray(options) ? options : []}
                disableClearable={disableClearable}
                isOptionEqualToValue={() => true}
                disabled={disabled}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size='small'
                    className='rounded-lg overflow-hidden'
                  />
                )}
              />
            )}
          />
        </div>
      )}
      <ErrorMessage message={errors?.[name]?.message} />
    </Field>
  );
};
