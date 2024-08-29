import { useServiceJobStore } from "@/store";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface InputCellProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

export const StaticAutocomplete = ({ getValue, row, column, table }: InputCellProps) => {
  const initialValue = getValue();
  const [val, setVal] = useState(initialValue);
  const { discounts, services } = useServiceJobStore();
  const isClearable = row.index == 1 ? true : false;

  useEffect(() => {
    setVal(initialValue);
  }, [initialValue]);

  const optionsMap: { [key: number]: OptionType[] } = {
    0: services,
    1: discounts
  };

  const onChange = (newValue: any) => {
    //setVal(newValue);
    //table.options.meta?.updateData(row.index, column.id, newValue);
  };

  return (
    <Autocomplete
      autoHighlight
      autoSelect
      selectOnFocus
      handleHomeEndKeys
      clearOnEscape
      disableClearable={!isClearable}
      onChange={onChange}
      options={optionsMap[row.index] || discounts}
      isOptionEqualToValue={() => true}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      )}
    />
  );
};
