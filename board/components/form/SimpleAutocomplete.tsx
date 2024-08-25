import { Autocomplete, TextField, Skeleton, createFilterOptions } from '@mui/material';
import { Field, Label } from "@headlessui/react";

const filter = createFilterOptions<OptionType>();
interface SimpleAutocompleteProps {
  name: string;
  options: OptionType[] | null;
  label: string;
  isLoading: boolean;

  onChange?: (event: React.SyntheticEvent, newValue: OptionType | null, reason?: string) => void;
  filterOptions?: (options: any, params: any) => OptionType[];
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

// Componente SimpleAutocomplete
const SimpleAutocomplete: React.FC<SimpleAutocompleteProps> = ({
  name,
  options,
  onChange,
  label,
  isLoading,
  filterOptions = defaultFilterOptions,
}) => {
  return (
    <Field>
      <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{label}</Label>
      {isLoading ? (
        <Skeleton variant="rectangular" width={210} height={32} />
      ) : (
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
              size="small"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          )}
        />
      )}
    </Field>
  );
};

export default SimpleAutocomplete;
