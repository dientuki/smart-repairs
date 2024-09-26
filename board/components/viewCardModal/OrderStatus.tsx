import { dynamicStyles } from "@/helper/componentsHelpers";
import { StyleColor } from "@/types/enums";

interface OrderStatusProps {
  status: string;
}

export const OrderStatus = ({ status }: OrderStatusProps) => (
  <div
    style={dynamicStyles(StyleColor.Info)}
    className='text-center justify-center gap-x-1 rounded-md text-base font-medium ring-1 ring-inset px-2 py-1 bg-custom-50 text-custom-600 ring-custom-600/10 dark:bg-custom-400/10 dark:text-custom-400 dark:ring-custom-400/30'
  >
    {status}
  </div>
);
