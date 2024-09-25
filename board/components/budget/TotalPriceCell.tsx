import { useUserStore } from "@/store";
import { FakeInput } from "@/components/form";

interface TotalPriceProps {
  getValue: () => any;
}

export const TotalPriceCell = ({ getValue }: TotalPriceProps) => {
  const { user } = useUserStore();

  return (
    <FakeInput
      value={getValue()}
      icon={user?.currency}
      className='text-right'
    />
  );
};
