interface DisplayAmountProps {
  text: string
  amount: number;
  currency: string;
}

export const DisplayAmount = ({ text, amount, currency }: DisplayAmountProps) => {

  return (
    <div className="flex gap-3 py-1">
      <div className="w-1/2">{text}</div>
      <div className="w-1/2 px-3 flex justify-between">
        <div>{currency}</div>
        <div>{amount}</div>
      </div>
    </div>
  );
};
