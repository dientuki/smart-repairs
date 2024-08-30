import { useEffect, useState } from "react";
import { Controller } from 'react-hook-form';
import { Input } from "@headlessui/react";

export const InputCell = ({ getValue, row, column, table }: InputCellProps) => {
  const initialValue = getValue();
  const [val, setVal] = useState(initialValue);
  const name = `${column.columnDef.meta?.name}.${row.id}.${column.id}`;
  const errorMessage = column.columnDef.meta.errors.items?.[row.index]?.[column.id] ?? null;
  const isHidden = (row.index === 0 || row.index === 1) && column.id === "quantity";

  useEffect(() => {
    setVal(initialValue);
  }, [initialValue]);


  const handleChange = (newValue: any) => {
    setVal(newValue);
    table.options.meta?.updatePrice(row.index, column.id, newValue);
  };

  if (isHidden) {
    return null; // No renderiza nada si se cumple la condición
  }

  return (
    <Controller
      name={name}
      control={column.columnDef.meta.control}
      rules={column.columnDef.meta.rules}
      defaultValue={initialValue}
      render={({ field }) => (
        <Input
          {...field}
          value={val}
          type={column.columnDef.meta?.type || 'text'}
          onChange={(e) => {
            const value = column.columnDef.meta?.type === 'number' ? parseFloat(e.target.value) : e.target.value;
            field.onChange(value); // Actualiza react-hook-form
            handleChange(value); // Llama a tu función personalizada
          }}
          className={`${column.id == 'quantity' ? 'text-center' : ''} rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 p-2.5 ${
            errorMessage ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500' : ''}
            `}
        />
      )}
    />
  );
};
