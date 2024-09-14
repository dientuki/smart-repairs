import { dynamicStyles } from "@/helper/componentsHelpers";
import { useOrderStore } from "@/store/OrderStore";
import { StyleColor } from "@/types/enums";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Avatar from "react-avatar";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";

export const Details = () => {
  const { order  } = useOrderStore();
  const { t } = useTranslation();

  const assignOrder = () => {

  }

  return (
    <div className="p-3 rounded-xl shadow-sm ring-1 ring-gray-950/5 dark:ring-white/10 flex flex-col gap-2 bg-white dark:bg-white/5">
      <div className="flex justify-between w-full">
          <p className="w-1/3 first-letter:uppercase">{t('order.created_at')}</p>
          <p className="w-2/3 truncate">{order.createdAtDate.toLocaleDateString()} {order.createdAtDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div className="flex justify-between w-full">
          <p className="w-1/3 first-letter:uppercase">{t('order.customer')}</p>
          <p className="w-2/3 truncate">{order.customerFullName}</p>
      </div>
      <div className="flex items-center justify-between w-full">
        <p className="w-1/3 first-letter:uppercase">{t('order.whatsapp')}</p>
        <a target="_blank" href={`https://wa.me/${order.customerPhone}`} className="w-2/3 flex flex-row gap-1 items-center " rel="noreferrer">
          <Avatar unstyled={true} name="Whatsap" maxInitials={1} round={false} size="28" src="/icons/whatsapp.svg" />
          <span className="truncate">{order.customerPhone}</span>
        </a>
      </div>
      <div className="flex items-center justify-between w-full">
          <p className="w-1/3 first-letter:uppercase">{t('order.created_by')}</p>
          <p className="w-2/3 flex flex-row gap-1 items-center ">
            <Avatar name={order.creator} maxInitials={2} round={true} size="28" src={order.creatorAvatar} />
            <div className="truncate">{order.creator}</div>
          </p>
      </div>

      <div className="flex items-center justify-between w-full">
          <p className="w-1/3 first-letter:uppercase">{t('order.assigned_to')}</p>
          <p className="w-2/3 flex flex-row gap-1 items-center">
            {order.assignee ?
              <>
                <Avatar name={order.assignee} maxInitials={2} round={true} size="28" src={order.assigneeAvatar} />
                <div className="truncate">{order.assignee}</div>
              </>
              :
              <>
                <Icon icon={UserCircleIcon} size={7} />
                <div className="truncate first-letter:uppercase">{t('order.unassigned')}</div>
              </>
            }
          </p>
      </div>
      <div onClick={assignOrder()} style={dynamicStyles(StyleColor.Primary)} className="pl-9 hover:underline cursor-pointer flex items-center self-end w-2/3 font-semibold text-sm text-custom-600 dark:text-custom-400"><span className="first-letter:uppercase">{t('order.assign_to_me')}</span></div>

    </div>
  );
};
