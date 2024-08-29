import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { useModalWindow } from "react-modal-global";
import { useOrderStore } from "@/store/OrderStore";
import Comments from "@/components/Comments";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Modal, UpdateDeviceUnitModal, ModalLayout } from "@/components/modal";
import { ActionButton } from "@/components/form";
import { BudgetModal } from "@/components/budget";


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
          <div className="flex flex-row h-full">
            <div className="basis-3/4 pr-6 overflow-y-scroll mr-3">
              <h2 className="text-2xl font-medium leading-6 text-gray-900">
                {order.brand} {order.deviceCommercialName}{order.deviceTechName && ` (${order.deviceTechName})`}
              </h2>
              <p className="my-2">
                <b>Serie:</b> {order.deviceSerial ? order.deviceSerial : "Serial number not available"}
              </p>
              <div>
                <p><b>Descripcion inicial del problema:</b></p>
                <p className="border border-gray-300 p-3 rounded min-h-20">{order.observation}</p>
              </div>
              <div className="my-2">
                Presupuesto si lo tiene
                <br />edistar
              </div>
              <Comments orderId={order.$id} comments={order.comments?.length ? order.comments : []}/>
            </div>
            <div className="basis-1/4">
              <p>Estado: {order.status}</p>
              <div className="border border-gray-300 p-3 rounded mt-4">
                <p className="my-2">Fecha de entrada: {order.createdAtDate?.toDateString()} {order.createdAtDate?.toLocaleTimeString()}</p>
                <p className="my-2">Cliente: {order.customerFullName}</p>
                <p className="my-2">Whatsap: <a target="_blank" href={`https://wa.me/${order.customerPhone}`}>whatsap</a></p>
                <p className="my-2">Tecnico: Usuario</p>
                <p className="my-2">Vendedor: {order.author}</p>
              </div>
              <div className="border border-gray-300 p-3 rounded mt-4">
                <p className="my-2">Desbloqueo: Codigo/patron</p>
                <p className="my-2">Validaciones: Usuario</p>
              </div>
              <div>
                <ActionButton
                  onClick={handleUpdateDeviceUnit}
                  customClass="w-full mt-4"
                  type="button">
                    { order.deviceUnitId ? t('button.update') : t('button.validate') } {t('device')}
                </ActionButton>
                <ActionButton
                  customClass="w-full mt-4"
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