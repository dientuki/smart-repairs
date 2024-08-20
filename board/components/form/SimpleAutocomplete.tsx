import { Autocomplete, TextField, Skeleton } from '@mui/material';
import { Field, Label } from "@headlessui/react";

interface SimpleAutocompleteProps {
  id: string;
  options: OptionType[];
  onChange?: (event: React.SyntheticEvent, newValue: OptionType | null, reason?: string) => void;
  label: string;
  isLoading: boolean;
  filterOptions?: (options: any, params: any) => OptionType[];
}

// Componente SimpleAutocomplete
const SimpleAutocomplete: React.FC<SimpleAutocompleteProps> = ({
  id,
  options,
  onChange,
  label,
  isLoading,
  filterOptions
}) => {
  return (
    <Field>
      <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{label}</Label>
      {isLoading ? (
        <Skeleton variant="rectangular" width={210} height={32} />
      ) : (
        <Autocomplete
          id={id}
          selectOnFocus
          handleHomeEndKeys
          onChange={onChange}
          options={options}
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
