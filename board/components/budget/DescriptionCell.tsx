import { Autocomplete, TextField } from "@mui/material";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { FakeInput } from "@/components/form";
import { getType } from "@/helper/budgetHelpers";
import { t } from "i18next";

interface DescriptionCellProps {
  control: Control<FieldValues>;
  errors?: FieldErrors<FieldValues>;
  rules?: RegisterOptions;
  index: number;
  options: OptionType[];
  onChange: (
    newValue: OptionType | null,
    reason: string,
    index: number,
  ) => void;
  type: string;
}

const getError = (
  errors: FieldErrors<FieldValues> | undefined,
  index: number,
): boolean => {
  // Verifica si `errors` está definido y si tiene la propiedad `items`
  if (Array.isArray(errors?.items)) {
    return !!(
      errors.items.length &&
      index >= 0 &&
      index < errors.items.length &&
      errors.items[index]
    );
  }
  return false;
};

export const DescriptionCell = ({
  control,
  errors,
  rules = {},
  index,
  options,
  onChange,
  type,
}: DescriptionCellProps) => {
  const hasError = getError(errors, index);

  return (
    <div className='flex flex-row items-center gap-3'>
      <div className='w-32'>
        <FakeInput value={type} />
      </div>
      <div
        className={`w-full rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 [&:not(:has(.fi-ac-action:focus))]:focus-within overflow-hidden
              ${
                hasError
                  ? "ring-danger-600 dark:ring-danger-500 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-danger-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-danger-500"
                  : "ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500"
              }`}
      >
        <Controller
          name={`items.${index}.itemable`}
          control={control}
          rules={rules}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              autoSelect
              selectOnFocus
              handleHomeEndKeys
              clearOnEscape
              onChange={(_, newValue, reason) => {
                field.onChange(newValue);
                onChange(newValue, reason, index);
              }}
              options={options}
              value={field.value || null}
              groupBy={(option) => option.info.item_type}
              getOptionLabel={(option) => option.label}
              renderGroup={(params) => (
                <li
                  key={params.key}
                  className='text-gray-950 dark:text-white dark:bg-gray-900'
                >
                  <div className='sticky -top-2 py-1 px-2 text-lg font-semibold border-b border-black shadow-md dark:border-gray-600 dark:shadow-lg bg-white dark:bg-gray-900'>
                    {t(getType(params.group))}
                  </div>
                  <ul>{params.children}</ul>
                </li>
              )}
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
    </div>
  );
};
