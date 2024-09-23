import { useUserStore } from "@/store";
import { DisplayAmount, DisplayTotal } from "@/components/budget";

interface BudgetResumeProps {
  data: BudgetResumeData;
}

export const BudgetResume = ({ data }: BudgetResumeProps) => {
  const { user } = useUserStore();
  const { subtotal, discount, total } = data;

  return (
    <div className='flex flex-col'>
      <DisplayAmount
        text='Subtotal'
        amount={subtotal}
        currency={user?.currency}
      />
      <DisplayAmount
        text='Descuento'
        amount={discount}
        currency={user?.currency}
      />
      <DisplayTotal text='Total' amount={total} currency={user?.currency} />
    </div>
  );
};
