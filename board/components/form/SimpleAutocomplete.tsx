import {
  Autocomplete,
  TextField,
  Skeleton,
  createFilterOptions,
  FilterOptionsState,
} from "@mui/material";
import { Field, Label } from "@headlessui/react";

const filter = createFilterOptions<OptionType>();
interface SimpleAutocompleteProps {
  name: string;
  options: OptionType[] | null;
  label: string;
  isLoading: boolean;

  onChange?: (
    event: React.SyntheticEvent,
    newValue: OptionType | null,
    reason?: string,
  ) => void;

  filterOptions?: (options: OptionType[], state: FilterOptionsState<OptionType>) => OptionType[];
}

const defaultFilterOptions = (options: OptionType[], params: FilterOptionsState<OptionType>) => {
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

// Componente SimpleAutocomplete
export const SimpleAutocomplete = ({
  name,
  options,
  onChange,
  label,
  isLoading,
  filterOptions = defaultFilterOptions,
}:SimpleAutocompleteProps) => {
  return (
    <Field>
      <Label className='first-letter:uppercase block mb-2 text-base font-medium text-gray-900'>
        {label}
      </Label>
      {isLoading ? (
        <Skeleton variant='rectangular' width={210} height={32} />
      ) : (
        <div className="w-full rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 [&:not(:has(.fi-ac-action:focus))]:focus-within overflow-hidden ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500">
          <Autocomplete
            autoHighlight
            autoSelect
            selectOnFocus
            handleHomeEndKeys
            clearOnEscape
            id={name}
            onChange={onChange}
            options={Array.isArray(options) ? options : []}
            filterOptions={filterOptions}
            isOptionEqualToValue={() => true}
            renderInput={(params) => (
              <TextField
                {...params}
                size='small'
                className='rounded-lg overflow-hidden'
              />
            )}
          />
        </div>
      )}
    </Field>
  )
};
