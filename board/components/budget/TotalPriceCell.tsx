import { useUserStore } from "@/store";
import { FakeInput } from "../form/FakeInput";

export const TotalPriceCell = ({
  getValue,
  row,
  column,
  table,
}: InputCellProps) => {

  const name = `5`;
  const { user } = useUserStore();

  return (
    <FakeInput
      value={name}
      icon={user?.currency}
    />
  );
};
