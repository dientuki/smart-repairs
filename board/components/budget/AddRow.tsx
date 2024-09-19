import { StyleColor } from "@/types/enums";
import { ActionButton } from "@/components/form";
import { t } from "i18next";

export const AddRow = ({ table }) => {
  const meta = table.options.meta;

  return (
    <ActionButton onClick={meta?.addRow} style={StyleColor.Primary} customClass="w-full">
      {t('button.add')} {t('budget.item')}
    </ActionButton>
  );
};
