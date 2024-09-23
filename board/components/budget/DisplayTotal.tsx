import { FakeInput } from "@/components/form";

interface DisplayTotalProps {
  text: string;
  amount: number;
  currency: string;
}

export const DisplayTotal = ({ text, amount, currency }: DisplayTotalProps) => {
  return (
    <div className='flex gap-3 py-1 items-center'>
      <div className='w-1/2'>{text}</div>
      <div className='w-1/2'>
        <FakeInput value={amount} icon={currency} className='text-right' />
      </div>
    </div>
  );
};
