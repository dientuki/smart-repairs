import { useEffect, useState } from "react";
import { Controller } from 'react-hook-form';
import { Input } from "@headlessui/react";

interface InputCellProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

export const InputCell = ({ getValue, row, column, table }: InputCellProps) => {
  const initialValue = getValue();
  const [val, setVal] = useState(initialValue);
  const name = `${column.columnDef.meta?.name}.${row.id}.${column.id}`;

  useEffect(() => {
    setVal(initialValue);
  }, [initialValue]);

  const handleChange = (newValue: any) => {
    setVal(newValue);
    table.options.meta?.updateData(row.index, column.id, newValue);
    console.log('Actualización en onChange');
  };

  return (
    <Controller
      name={name}
      control={column.columnDef.meta.control}
      rules={column.columnDef.meta.rules}
      defaultValue={initialValue}
      render={({ field }) => (
        <Input
          {...field}
          type="text"
          value={val}
          onChange={(e) => {
            field.onChange(e); // Actualiza react-hook-form
            handleChange(e.target.value); // Llama a tu función personalizada
          }}
        />
      )}
    />
  );
};
