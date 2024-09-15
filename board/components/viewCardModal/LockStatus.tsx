import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/Icon";

interface LockStatusProps {
  toggleVisibility: () => void;
  status: boolean;
}

export const LockStatus = ({ toggleVisibility, status }: LockStatusProps) => {
  const { t } = useTranslation();

  return (
    <div
      className='flex flex-row items-center gap-1 cursor-pointer'
      onClick={toggleVisibility}
    >
      {status ? (
        <>
          <Icon icon={LockOpenIcon} size={4} data-testid="lock-open-icon"/>
          <span className='ml-1 first-letter:uppercase'>{t("private")}a</span>
        </>
      ) : (
        <>
          <Icon icon={LockClosedIcon} size={4} data-testid="lock-closed-icon"/>
          <span className='ml-1 first-letter:uppercase'>{t("public")}v</span>
        </>
      )}
    </div>
  );
};
