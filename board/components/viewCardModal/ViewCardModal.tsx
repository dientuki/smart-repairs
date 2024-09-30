import { useModalWindow } from "react-modal-global";
import { useOrderStore } from "@/store/OrderStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Modal, UpdateDeviceUnitModal, ModalLayout } from "@/components/modal";
import { ActionButton } from "@/components/form";
import { BudgetModal } from "@/components/budget";
import { Icon } from "@/components/Icon";
import {
  DevicePhoneMobileIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import {
  Comments,
  Description,
  Details,
  ChecklistDisplay,
  Diagnosis,
  OrderStatus,
} from "@/components/viewCardModal";
import { AbortControllerManager } from "@/helper/AbortControllerManager";

type ModalParams = {
  order: string;
};

export const ViewCardModal = () => {
  const modal = useModalWindow<ModalParams>();
  const { order, getOrder } = useOrderStore();
  const { t } = useTranslation();

  useEffect(() => {
    getOrder(modal.params.order).catch((e: any) => {
      toast.error(t(`toast.error.${e.message}`));
    });
    return () => {
      AbortControllerManager.abort();
    };
  }, [getOrder]);

  const handleUpdateDeviceUnit = () => {
    Modal.open(UpdateDeviceUnitModal, {
      layer: 5,
      order: order.$id,
      deviceUnitId: order.deviceUnitId,
    });
  };

  const handleBudgetModal = () => {
    Modal.open(BudgetModal, { layer: 5, order: order.$id });
  };

  return (
    <ModalLayout>
      {modal.params.order == order.$id && (
        <div className='h-full flex flex-col'>
          <h2 className='flex flex-row items-center gap-2 px-5 py-3 text-2xl font-bold tracking-tight sm:text-3xl'>
            <Icon size={7} icon={DevicePhoneMobileIcon} />
            <span>
              {order.brand} {order.deviceCommercialName}
              {order.deviceTechName && ` (${order.deviceTechName})`}
            </span>
          </h2>

          <div className='flex flex-row flex-grow border-t border-gray-200 dark:border-white/10 px-5 py-3 text-base min-h-0'>
            <div className='basis-3/4 pr-4 mr-3 flex flex-col gap-6 overflow-y-scroll min-h-full max-h-full'>
              <div className='flex flex-row items-center gap-2'>
                <Icon size={7} icon={HashtagIcon} />
                <span className='text-1xl font-bold tracking-tight sm:text-2xl first-letter:uppercase'>
                  <b>{t("order.serial")}:</b>{" "}
                  {order.deviceSerial
                    ? order.deviceSerial
                    : t("order.no_serial")}
                </span>
              </div>
              <Description />
              <Diagnosis />
              <Comments />
            </div>

            <div className='basis-1/4 flex flex-col gap-4 overflow-y-scroll min-h-full max-h-full pr-2 pl-1'>
              <OrderStatus status={t(`status.${order.status}`)} />
              <Details />
              <ChecklistDisplay
                title={t("order.damages")}
                checklist={order.orderCheck.damages}
                extraDetails={order.orderCheck.damagesDescription}
                error={t("order.damages_empty")}
              />
              <ChecklistDisplay
                title={t("order.features")}
                checklist={order.orderCheck.features}
                extraDetails={order.orderCheck.featuresDescription}
                error={t("order.damages_empty")}
              />
              <ActionButton onClick={handleUpdateDeviceUnit} className='w-full'>
                {order.deviceUnitId ? t("button.update") : t("button.validate")}{" "}
                {t("device")}
              </ActionButton>
              <ActionButton
                className='w-full'
                disabled={order.deviceUnitId == null && !order.hasBudget}
                onClick={handleBudgetModal}
              >
                {t(`budget.button.${order.hasBudget ? "edit" : "add"}`)}
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </ModalLayout>
  );
};
