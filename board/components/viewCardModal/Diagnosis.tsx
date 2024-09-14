import { useOrderStore } from "@/store/OrderStore";
import Icon from "@/components/Icon";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export const Diagnosis = () => {
  const { order } = useOrderStore();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <Icon size={7} icon={DocumentTextIcon} />
          <span className="text-1xl font-bold tracking-tight sm:text-2xl first-letter:uppercase">{t('order.diagnosis')}</span>
        </div>
        <div>Button</div>
      </div>
      <div className="ml-9 first-letter:uppercase">
        {order.diagnosis ? order.diagnosis : t('order.no_diagnosis')}
      </div>
    </div>
  );
};
