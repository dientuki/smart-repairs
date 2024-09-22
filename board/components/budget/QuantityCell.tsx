import { InputType } from "@/types/enums";
import { InputField } from "@/components/form";
import { t } from "i18next";
import { Itemable } from "@/types/budget";
import { useEffect, useState } from "react";

export const QuantityCell = ({
  getValue,
  row,
  column,
  table,
}: InputCellProps) => {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)
  const name = `${column.columnDef.meta?.name}.${row.id}.${column.id}`;
  const control = column.columnDef.meta.control;
  let disabled = false;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //const q = parseFloat(e.target.value);
    //table.options.meta?.updatePrice(row.index, column.id, q);
  };

  useEffect(() => {
    console.log(name, 'cambio')
    setValue(initialValue)
  }, [initialValue])

  if (table.options.data[row.index].itemable) {
    disabled =
      table.options.data[row.index].itemable.info.item_type.indexOf(
        Itemable.Part,
      ) === -1;
  }

  return (
    <InputField
      name={name}
      label={t("budget.quantity")}
      labelless
      control={control}
      rules={column.columnDef.meta.rules}
      defaultValue='1'
      forceValue={value || "1"}
      errors={column.columnDef.meta.errors}
      type={InputType.Number}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};
