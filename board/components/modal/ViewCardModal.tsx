import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { useModalWindow } from "react-modal-global";
import { useOrderStore } from "@/store/OrderStore";
import Comments from "@/components/Comments";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Modal, UpdateDeviceUnitModal, ModalLayout } from "@/components/modal";
import { ActionButton, InputField } from "@/components/form";
import { BudgetModal } from "@/components/budget";
import { Field, Input, Label } from "@headlessui/react";


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
              <h2 className="text-3xl font-medium leading-6 text-gray-900">
                {order.brand} {order.deviceCommercialName}{order.deviceTechName && ` (${order.deviceTechName})`}
              </h2>
              <p className="my-2">
                <b>Serie:</b> {order.deviceSerial ? order.deviceSerial : "Serial number not available"}
              </p>
              <div>
                <p><b>Descripcion inicial del problema:</b></p>
                <p className="border border-gray-300 p-3 rounded min-h-20">{order.observation}</p>
                <Field className="display-block h-20">
                  <Label className="first-letter:uppercase block mb-2 text-base font-medium text-gray-900">Diagnosticar</Label>
                  <Input name="observation" className="float-left w-3/4 rounded-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block text-base border-gray-300 p-2.5"  />
                  <ActionButton className="w-1/4 float-right">diagnosticar</ActionButton>
                </Field>
              </div>
              <div className="my-2">
              <table className="w-full relative overflow-x-auto shadow-md sm:rounded-lg text-left rtl:text-right text-gray-500 dark:text-gray-400">
  <thead className="text-lg text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th className="py-1 px-2">Descripcion</th>
      <th className="w-20 text-center py-1 px-2">Cantidad</th>
      <th className="w-40 text-center py-1 px-2">Precio unitario</th>
      <th className="w-40 text-center py-1 px-2">Precio total</th>
      <th className="w-20 py-1 px-2">¿Suma?</th>
      <th className="w-10 py-1 px-2"></th>
    </tr>
  </thead>
  <tbody>
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <td className="p-2">Mano de obra</td>
      <td className="p-2 text-center">1</td>
      <td className="p-2 text-center">$25,000</td>
      <td className="p-2 text-center">$25,000</td>
      <td className="p-2 text-center">
        <label className="flex w-full cursor-pointer justify-center items-center">
          <input type="checkbox" className="sr-only peer" disabled checked />
          <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </td>
      <td className="p-2"></td>
    </tr>
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <td className="p-2"></td>
      <td className="p-2 text-center">0</td>
      <td className="p-2 text-center">$0</td>
      <td className="p-2 text-center">$0</td>
      <td className="p-2 text-center">
        <label className="flex w-full cursor-pointer justify-center items-center">
          <input type="checkbox" className="sr-only peer" disabled />
          <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </td>
      <td className="p-2"></td>
    </tr>
    <tr>
      <td colSpan={6} className="bg-gray-50 dark:bg-gray-800">
        <div className="p-2 text-gray-900 dark:text-gray-400 flex justify-between items-center">
          <div className="text-xl font-semibold">Total</div>
          <div className="text-lg font-bold">$25,000</div>
        </div>
      </td>
    </tr>
  </tbody>
</table>

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