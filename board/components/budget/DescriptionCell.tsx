import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { FakeInput } from "@/components/form";
import { t } from "i18next";
import { BudgetColumns, Itemable } from "@/types/enums";

interface DescriptionCellProps {
  control: Control<FieldValues>;
  errors?: FieldErrors<FieldValues>;
  rules?: RegisterOptions;
  index: number;
  options: OptionType[];
  updateDescription: (rowIndex: number, item: any) => void;
  type: string;
}
export const DescriptionCell = ({
  control,
  errors,
  rules = {},
  index,
  options,
  updateDescription,
  type,
  resetRow,
}: DescriptionCellProps) => {
  const handleOnChange = (newValue: OptionType | null, reason: string) => {
    if (reason === "clear") {
      console.log("resetRow");
      resetRow(index);
    } else {
      updateDescription(index, newValue);
    }
  };

  const getType = (str: string) => {
    const tmp = str.split("\\");
    return t(`budget.type.${tmp[tmp.length - 1].toLowerCase()}`);
  };

  return (
    <div className='flex flex-row items-center gap-3'>
      <div className='w-32'>
        <FakeInput value={type} />
      </div>
      <div className='w-full rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 '>
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
                handleOnChange(newValue, reason);
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
                  <div className='sticky -top-2 py-1 px-2 text-lg font-semibold border-b border-black shadow-md dark:border-gray-600 dark:shadow-lg dark:bg-gray-900'>
                    {getType(params.group)}
                  </div>
                  <ul>{params.children}</ul>
                </li>
              )}
              renderInput={(params) => <TextField {...params} size='small' />}
            />
          )}
        />
      </div>
    </div>
  );
};
