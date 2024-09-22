import { ActionButton, CancelButton } from "../form";
import { HiddenInput } from "../form/HiddenInput";
import { StyleColor } from "@/types/enums";
import { t } from "i18next";

export const RemoveRow = ({ getValue, row, column, table }: InputCellProps) => {
  const initialValue = getValue();
  const meta = table.options.meta;
  const name = `${column.columnDef.meta?.name}.${row.id}.${column.id}`;

  const removeRow = () => {
    meta?.removeRow(row.index);
  };

  return (
    <>
      {table.getRowCount() === 1 ? (
        <CancelButton customClass='w-full'>
          {t("button.delete")} {t("budget.item")}
        </CancelButton>
      ) : (
        <ActionButton
          onClick={removeRow}
          style={StyleColor.Danger}
          customClass='w-full'
        >
          {t("button.delete")} {t("budget.item")}
        </ActionButton>
      )}
      <HiddenInput
        name={name}
        control={column.columnDef.meta.control}
        rules={column.columnDef.meta.rules}
        defaultValue={initialValue}
      />
    </>
  );
};
