import { useEffect, useState } from "react";
import { ToggleField } from "@/components/form";
import { Switch } from "@headlessui/react";
import { Controller } from "react-hook-form";

export const BooleanCell = ({
  getValue,
  row,
  column,
  table,
}: BooleanCellProps) => {
  const checked = true;
  const name = `${column.columnDef.meta?.name}.${row.id}.${column.id}`;
  /*
  const initialValue = getValue();

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setValue(newValue);

    // Actualiza los datos en el `onChange`
    table.options.meta?.updateSum(row.index, newValue);
  };
  */
  return (
    <Controller
      name={name}
      control={column.columnDef.meta.control}
      rules={column.columnDef.meta.rules}
      defaultValue={checked}
      render={({ field }) => (
        <Switch
          {...field}
          name={name}
          className='group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600'
        >
          <span className='size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6' />
        </Switch>
      )}
    />
  );
};
