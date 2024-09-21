import { InputField } from "@/components/form";
import { useUserStore } from "@/store";
import { DiscountType, InputType, Itemable } from "@/types/enums";

export const UnitPriceCell = ({
  getValue,
  row,
  column,
  table,
}: InputCellProps) => {
  const { user } = useUserStore();
  const value = getValue();
  const name = `${column.columnDef.meta?.name}.${row.id}.${column.id}`;
  let currency = user?.currency;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = parseFloat(e.target.value);
    table.options.meta?.updatePrice(row.index, column.id, q);
  };

  if (
    table.options.data[row.index].itemable &&
    table.options.data[row.index].itemable.info.item_type.includes(
      Itemable.Discount,
    )
  ) {
    if (
      table.options.data[row.index].itemable.info.type ===
      DiscountType.Percentage
    ) {
      currency = "%";
    }
  }

  return (
    <InputField
      name={name}
      label={column.id}
      labelless
      control={column.columnDef.meta.control}
      rules={column.columnDef.meta.rules}
      defaultValue='0'
      forceValue={value || "0"}
      errors={column.columnDef.meta.errors}
      type={InputType.Number}
      icon={currency}
      onChange={handleChange}
    />
  );
};
