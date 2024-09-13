import { useModalWindow } from "react-modal-global";
import { useOrderStore } from "@/store/OrderStore";
import Comments from "@/components/viewCardModal/Comments";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Modal, UpdateDeviceUnitModal, ModalLayout } from "@/components/modal";
import { ActionButton } from "@/components/form";
import { BudgetModal } from "@/components/budget";
import Icon from "@/components/Icon";
import { DevicePhoneMobileIcon, HashtagIcon } from "@heroicons/react/24/outline";
import { Description } from "./Description";
import { Diagnosis } from "./Diagnosis";
import { Details } from "./Details";
import { DeviceCheck } from "./DeviceCheck";
import { dynamicStyles } from "@/helper/componentsHelpers";
import { StyleColor } from "@/types/enums";


type ModalParams = {
  order: string;
};

function ViewCardModal() {
  const modal = useModalWindow<ModalParams>();
  const { order, getOrder } = useOrderStore();
  const { t } = useTranslation();

  useEffect(() => {
    getOrder(modal.params.order).catch((e: any) => {
      toast.error(t(`toast.error.${e.message}`));
    });
  }, [getOrder]);

  const handleUpdateDeviceUnit = () => {
    Modal.open(UpdateDeviceUnitModal, {layer: 5, order: order.$id, deviceUnitId: order.deviceUnitId});
  }

  const handleBudgetModal = () => {
    Modal.open(BudgetModal, {layer: 5, order: order.$id});
  }

  return (
    <ModalLayout>
      {(modal.params.order == order.$id) &&
          <div className="h-full text-gray-950 dark:text-white">
            <h2 className="flex flex-row items-center gap-2 px-5 py-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <Icon size={7} icon={DevicePhoneMobileIcon} />
              <span>{order.brand} {order.deviceCommercialName}{order.deviceTechName && ` (${order.deviceTechName})`}</span>
            </h2>
            <div className="flex flex-row border-t border-gray-200 dark:border-white/10 px-5 py-3 text-base">
              <div className="basis-3/4 pr-6 overflow-y-scroll mr-3">
                <div className="flex flex-row items-center gap-2">
                  <Icon size={7} icon={HashtagIcon} />
                  <span className="text-1xl font-bold tracking-tight sm:text-2xl"><b>Serie:</b> {order.deviceSerial ? order.deviceSerial : "Serial number not available"}</span>
                </div>
                <Description />
                <Diagnosis />
                <Comments orderId={order.$id} comments={order.comments?.length ? order.comments : []}/>
              </div>
              <div className="basis-1/4 flex flex-col gap-3">
                <div style={dynamicStyles(StyleColor.Info)} className="text-center justify-center gap-x-1 rounded-md text-base font-medium ring-1 ring-inset px-2  py-1 bg-custom-50 text-custom-600 ring-custom-600/10 dark:bg-custom-400/10 dark:text-custom-400 dark:ring-custom-400/30">{t(`status.${order.status}`)}</div>
                <Details />
                <DeviceCheck />
                <DeviceCheck />
                <ActionButton
                  onClick={handleUpdateDeviceUnit}
                  customClass="w-full"
                  type="button">
                    { order.deviceUnitId ? t('button.update') : t('button.validate') } {t('device')}
                </ActionButton>
                <ActionButton
                  customClass="w-full"
                  disabled={order.deviceUnitId == null && !order.hasBudget}
                  onClick={handleBudgetModal}
                  type="button">
                    { t('button.quote') }
                </ActionButton>
              </div>
            </div>
          </div>
      }
    </ModalLayout>
  )
}

export default ViewCardModal;