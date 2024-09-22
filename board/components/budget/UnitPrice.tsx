import { InputField } from "@/components/form";
import { useUserStore } from "@/store";
import { Itemable } from "@/types/budget";
import { DiscountType, InputType } from "@/types/enums";
import { useEffect, useState } from "react";

export const UnitPriceCell = ({
  getValue,
  row,
  column,
  table,
}: InputCellProps) => {
  const { user } = useUserStore();

  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)

  const name = `${column.columnDef.meta?.name}.${row.id}.${column.id}`;
  let currency = user?.currency;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //const q = parseFloat(e.target.value);
    //table.options.meta?.updatePrice(row.index, column.id, q);
  };

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

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
