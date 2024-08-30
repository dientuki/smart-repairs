import { useBudgetStore, useServiceJobStore } from "@/store";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect } from "react";

export const StaticAutocomplete = ({ getValue, row, column, table }: StaticAutocomplete) => {
  const { discounts, services } = useServiceJobStore();
  const { parts } = useBudgetStore();
  const optionsMap: { [key: number]: OptionType[] } = {
    0: services,
    1: discounts
  };
  const isClearable = row.index == 1 ? true : false;
  const options = optionsMap[row.index] || parts;

  useEffect(() => {

    if (row.index == 0) {
      table.options.meta?.updateServiceId(row.index, options[0].id)
      table.options.meta?.updatePrice(row.index, 'unitPrice', options[0].info)
    }

  }, []);

  const handleOnChange = (newValue: OptionType | null, reason: string) => {
    if (reason === 'clear') {
      //table.options.meta?.updateItem(row.index, 0)
      table.options.meta?.updatePrice(row.index, 'unitPrice', 0)
    } else {
      let price: number = 0; // Valor por defecto en caso de que no se pueda obtener el precio

      if (newValue?.info && typeof newValue.info === 'object') {
        // Verifica si `info` es un objeto y luego accede a `price`
        price = newValue.info.price ? Number(newValue.info.price) : 0;
      }

      table.options.meta?.updateServiceId(row.index, newValue?.id ?? '');
      table.options.meta?.updatePrice(row.index, 'unitPrice', price);
    }
  };

  return (
    <Autocomplete
      autoHighlight
      autoSelect
      selectOnFocus
      handleHomeEndKeys
      clearOnEscape
      disableClearable={!isClearable}
      onChange={(_, newValue, reason) => handleOnChange(newValue, reason)}
      options={options}
      defaultValue={row.index == 0 ? options[0] : null}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      )}
    />
  );
};
