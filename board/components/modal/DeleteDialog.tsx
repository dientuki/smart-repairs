import { useModalWindow } from "react-modal-global";
import { ActionButton, CancelButton } from "@/components/form";
import { StyleColor } from "@/types/enums";
import { useState } from "react";
import { dynamicStyles } from "@/helper/componentsHelpers";
import { Icon } from "@/components/Icon";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

type ModalParams = {
  record: string;
  onConfirm: () => void;
};

export const DeleteDialog = () => {
  const modal = useModalWindow<ModalParams>();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleConfirm = async () => {
    setLoading(true); // Establecer loading a true al iniciar la confirmación
    await modal.params.onConfirm(); // Ejecutar la función de confirmación
    setLoading(false);
  };

  return (
    <>
      <div className='transform overflow-hidden m-auto cursor-auto relative bg-white shadow-xl ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 rounded-xl p-6 text-base text-center w-96'>
        <div className='mb-5 flex items-center justify-center'>
          <div
            className='rounded-full bg-custom-100 dark:bg-custom-500/20 p-3'
            style={dynamicStyles(StyleColor.Danger)}
          >
            <Icon size={6} icon={TrashIcon} style={StyleColor.Danger} />
          </div>
        </div>
        <h2 className='text-lg font-semibold leading-6 text-gray-950 dark:text-white'>
          {t("dialog.delete")} {modal.params.record}
        </h2>
        <div className='text-gray-500 dark:text-gray-400 mt-2'>
          {t("dialog.question")}
        </div>
        <div className='flex flex-row gap-2 mt-6'>
          <CancelButton onClick={modal.close} className='w-full'>
            {t("button.cancel")}
          </CancelButton>
          <ActionButton
            onClick={handleConfirm}
            style={StyleColor.Danger}
            loading={loading}
            className='w-full'
          >
            {t("button.confirm")}
          </ActionButton>
        </div>
      </div>
    </>
  );
};
