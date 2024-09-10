import { useEffect, useState } from "react";

export const BooleanCell = ({ getValue, row, column, table }: BooleanCellProps ) => {
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

  return (
    <label className="flex w-full cursor-pointer justify-center items-center">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={value}  // Asignar correctamente el valor booleano
        onChange={handleChange}
        disabled={row.index == 0 ? true : false}
      />
      <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );
};
