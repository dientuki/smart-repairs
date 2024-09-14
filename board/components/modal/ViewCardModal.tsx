import { useModalWindow } from "react-modal-global";
import { useOrderStore } from "@/store/OrderStore";
import Comments from "@/components/viewCardModal/Comments";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Modal, UpdateDeviceUnitModal, ModalLayout } from "@/components/modal";
import { ActionButton, InputField } from "@/components/form";
import { BudgetModal } from "@/components/budget";
import { Field, Input, Label } from "@headlessui/react";
import Icon from "@/components/Icon";
import { Bars3BottomLeftIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";


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
                <p className="hidden">
                  <b>Serie:</b> {order.deviceSerial ? order.deviceSerial : "Serial number not available"}
                </p>
                <div className="flex flex-row items-center gap-2">
                  <Icon size={6} icon={Bars3BottomLeftIcon} />
                  <span className="text-1xl font-bold tracking-tight sm:text-2xl">Descripcion inicial del problema</span>
                </div>
                <div>
                  <p className="border border-gray-300 p-3 rounded min-h-20">{order.observation}</p>
                  <Field className="display-block h-20">
                    <Label className="first-letter:uppercase block mb-2 text-base font-medium text-gray-900">Diagnosticar</Label>
                    <Input name="observation" className="float-left w-3/4 rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block text-base border-gray-300 p-2.5"  />
                    <ActionButton className="w-1/4 float-right">diagnosticar</ActionButton>
                  </Field>
                </div>

                <Comments orderId={order.$id} comments={order.comments?.length ? order.comments : []}/>
              </div>
              <div className="basis-1/4">
                <p>Estado: {order.status}</p>
                <div className="border border-gray-300 p-3 rounded mt-4">
                  <p className="my-2">Fecha de entrada: {order.createdAtDate?.toDateString()} {order.createdAtDate?.toLocaleTimeString()}</p>
                  <p className="my-2">Cliente: {order.customerFullName}</p>
                  <p className="my-2">Whatsap: <a target="_blank" href={`https://wa.me/${order.customerPhone}`} rel="noreferrer">whatsap</a></p>
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
          </div>
      }
    </ModalLayout>
  )
}

export default ViewCardModal;