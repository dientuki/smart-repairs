import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@headlessui/react";

export const UnitPriceCell = ({
  getValue,
  row,
  column,
  table,
}: InputCellProps) => {
  const initialValue = getValue();
  const [val, setVal] = useState(initialValue);
  const name = `${column.columnDef.meta?.name}.${row.id}.${column.id}`;
  const errorMessage =
    column.columnDef.meta.errors.items?.[row.index]?.[column.id] ?? null;

  useEffect(() => {
    setVal(initialValue);
  }, [initialValue]);

  const handleChange = (newValue: any) => {
    setVal(newValue);
    table.options.meta?.updatePrice(row.index, column.id, newValue);
  };

  return (
    <Controller
      name={name}
      control={column.columnDef.meta.control}
      rules={column.columnDef.meta.rules}
      defaultValue={initialValue}
      render={({ field }) => (
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 w-10 flex items-center justify-center bg-gray-200 rounded-l-lg pointer-events-none'>
            <span className='text-gray-500 sm:text-sm'>$</span>
          </div>
          <Input
            {...field}
            value={val}
            type='number'
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              field.onChange(value);
              handleChange(value);
            }}
            className={`text-right pl-7 rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full text-base border-gray-300 p-2.5 ${
              errorMessage
                ? "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500"
                : ""
            }
              `}
          />
        </div>
      )}
    />
  );
};
