import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { FakeInput } from "../form";
import { t } from "i18next";
import { Itemable } from "@/types/enums";
import { BudgetColumns } from "@/types/budget";

export const DescriptionCell = ({
  getValue,
  row,
  column,
  table,
}: DescriptionCellProps) => {
  const value = getValue();
  const [type, setType] = useState<string>("");
  const options = column.columnDef.meta.data;
  const name = `${column.columnDef.meta?.name}.${row.id}.${column.id}`;

  useEffect(() => {
    if (value) {
      setType(getType(value.info.item_type));
    }
  }, [value]);

  const handleOnChange = (newValue: OptionType | null, reason: string) => {
    if (reason === "clear") {
      setType("");
      console.log("clear");
      table.options.meta?.resetRow(row.index);
    } else {
      //console.log('no clear')
      setType(getType(newValue.info.item_type));
      if (!newValue.info.item_type.includes(Itemable.Part)) {
        table.options.meta?.updatePrice(row.index, BudgetColumns.Quantity, 1);
      }
      table.options.meta?.updatePrice(
        row.index,
        BudgetColumns.UnitPrice,
        newValue.info.price,
      );
      table.options.meta?.updateItem(row.index, newValue);
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
          name={name}
          control={column.columnDef.meta.control}
          rules={column.columnDef.meta.rules}
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
              value={value || field.value || null}
              options={options}
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
