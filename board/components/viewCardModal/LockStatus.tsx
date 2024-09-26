import { useState } from 'react';
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/Icon";

interface LockStatusProps {
  toggleVisibility: () => void;
  status: boolean;
  disabled?: boolean;
}

export const LockStatus = ({
  toggleVisibility,
  status,
  disabled = false,
}: LockStatusProps) => {
  const { t } = useTranslation();

  const [stState, setStState] = useState(status);

  const handleStateChange = (value) => {
    setStState(value);
  };

  return (
    <div
      className={`flex flex-row items-center gap-1 ${!disabled ? "cursor-pointer" : ""}`}
      onClick={ () => { 
        if(!disabled ){
          toggleVisibility(); 
          handleStateChange(!stState);
        } else {
          undefined
        }
      }
    }
    >
      <>
        <Icon icon= {stState ? LockOpenIcon : LockClosedIcon} size={4} 
            data-testid = { stState ? 'lock-open-icon' : 'lock-closed-icon' }
          />
        <span className='ml-1 first-letter:uppercase'> { stState? t("public") : t("private")}</span>
      </>
    </div>
  );
};
