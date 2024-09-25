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
      <div className='w-1/6'>
        <FakeInput value={type} />
      </div>
      <div className='w-5/6'>
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
                <li key={params.key}>
                  <div className='sticky -top-2 p-[4px_10px] bg-white'>
                    {getType(params.group)}
                  </div>
                  <ul>{params.children}</ul>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                />
              )}
            />
          )}
        />
      </div>
    </div>
  );
};
