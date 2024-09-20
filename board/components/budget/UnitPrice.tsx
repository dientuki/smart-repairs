import { InputField } from "@/components/form";
import { useUserStore } from "@/store";
import { InputType } from "@/types/enums";

export const UnitPriceCell = ({
  getValue,
  row,
  column,
  table,
}: InputCellProps) => {
  const { user } = useUserStore();
  const initialValue = getValue();
  const name = `${column.columnDef.meta?.name}.${row.id}.${column.id}`;

  return (
    <InputField
      name={name}
      label={column.id}
      labelless
      control={column.columnDef.meta.control}
      rules={column.columnDef.meta.rules}
      defaultValue={initialValue}
      errors={column.columnDef.meta.errors}
      type={InputType.Number}
      icon={user?.currency}
    />
  );
};
