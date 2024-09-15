import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { Icon } from "@/components/Icon";
import { useTranslation } from "react-i18next";

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
          <Icon icon={LockOpenIcon} size={4} />
          <span className='ml-1 first-letter:uppercase'>{t("private")}</span>
        </>
      ) : (
        <>
          <Icon icon={LockClosedIcon} size={4} />
          <span className='ml-1 first-letter:uppercase'>{t("public")}</span>
        </>
      )}
    </div>
  );
};
