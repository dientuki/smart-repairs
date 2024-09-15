import { useOrderStore } from "@/store/OrderStore";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { Icon } from "@/components/Icon";
import { useTranslation } from "react-i18next";

export const Description = () => {
  const { order } = useOrderStore();
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row items-center gap-2'>
          <Icon size={7} icon={Bars3BottomLeftIcon} />
          <span className='text-1xl font-bold tracking-tight sm:text-2xl first-letter:uppercase'>
            {t("order.description")}
          </span>
        </div>
        <div>Button</div>
      </div>
      <div className='ml-9 first-letter:uppercase'>{order.observation}</div>
    </div>
  );
};
