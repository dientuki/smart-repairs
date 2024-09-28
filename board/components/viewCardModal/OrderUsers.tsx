import { dynamicStyles } from "@/helper/componentsHelpers";
import { useOrderStore, useUserStore } from "@/store";
import { PackageType, StyleColor } from "@/types/enums";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Avatar from "react-avatar";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/Icon";

export const OrderUsers = () => {
  const { order } = useOrderStore();
  const { user } = useUserStore();
  const { t } = useTranslation();

  if (!user || user.package === PackageType.Basic) {
    return null;
  }

  return (
    <>
      <div className='flex items-center justify-between w-full'>
        <p className='w-1/3 first-letter:uppercase'>{t("order.assigned_to")}</p>
        <div className='w-2/3 flex flex-row gap-1 items-center'>
          {order.assignee ? (
            <>
              <Avatar
                name={order.assignee}
                maxInitials={2}
                round={true}
                size='28'
                src={order.assigneeAvatar}
              />
              <div className='truncate'>{order.assignee}</div>
            </>
          ) : (
            <>
              <Icon icon={UserCircleIcon} size={7} />
              <div className='truncate first-letter:uppercase'>
                {t("order.unassigned")}
              </div>
            </>
          )}
        </div>
      </div>
      <div
        style={dynamicStyles(StyleColor.Primary)}
        className='pl-9 hover:underline cursor-pointer flex items-center self-end w-2/3 font-semibold text-sm text-custom-600 dark:text-custom-400'
      >
        <span className='first-letter:uppercase'>
          {t("order.assign_to_me")}
        </span>
      </div>
    </>
  );
};
