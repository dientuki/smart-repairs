import { useEffect, useState } from "react";

export const InputCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Actualiza los datos en el `onChange`
    table.options.meta?.updateData(row.index, column.id, newValue);
    console.log('Actualización en onChange');
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      type={column.columnDef.meta?.type || "text"}
    />
  );
};
