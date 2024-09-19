import { XCircleIcon } from "@heroicons/react/16/solid";
import { ActionButton } from "../form";
import { Icon } from "../Icon";
import { HiddenInputField } from "../form/HiddenInput";
import { StyleColor } from "@/types/enums";
import { t } from "i18next";

export const RemoveRow = ({
  getValue,
  row,
  column,
  table,
}: InputCellProps) => {
  const initialValue = getValue();
  const meta = table.options.meta;
  const name = `${column.columnDef.meta?.name}.${row.id}.${column.id}`;

  const removeRow = () => {
    meta?.removeRow(row.index);
  };



  return (
    <>
      <ActionButton onClick={removeRow} style={StyleColor.Danger} customClass="w-full">
        {t('button.delete')} {t('budget.item')}
      </ActionButton>
      <HiddenInputField
        name={name}
        control={column.columnDef.meta.control}
        rules={column.columnDef.meta.rules}
        defaultValue={initialValue}
           />
    </>
  );
};