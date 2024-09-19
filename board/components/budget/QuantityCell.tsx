import { InputType } from "@/types/enums";
import { InputField } from "@/components/form";

export const QuantityCell = ({
  getValue,
  row,
  column,
  table,
}: InputCellProps) => {
  const initialValue = getValue();
  const name = `${column.columnDef.meta?.name}.${row.id}.${column.id}`;

  return (
    <InputField
      name={name}
      label='label'
      labelless
      control={column.columnDef.meta.control}
      rules={column.columnDef.meta.rules}
      defaultValue={initialValue}
      errors={column.columnDef.meta.errors}
      type={InputType.Number}
    />
  );
};
