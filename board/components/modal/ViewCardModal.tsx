import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { useModalWindow } from "react-modal-global";
import { useOrderStore } from "@/store/OrderStore";
import Comments from "@/components/Comments";
import { useEffect } from "react";
import ModalLayout from "@/components/modal/ModalLayout";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

type ModalParams = {
  order: string;
};

function ViewCardModal() {
  const modal = useModalWindow<ModalParams>();
  const { order, getOrder } = useOrderStore();
  const { t } = useTranslation();

  useEffect(() => {
    getOrder(modal.params.order).catch((e: any) => {
      console.log(e.message);
      toast.error(t(`toast.error.${e.message}`));
    });
  }, [getOrder]);

  return (
    <ModalLayout>
      {(modal.params.order == order.$id) &&
          <div className="flex flex-row h-full">
            <div className="basis-3/4 pr-6 overflow-y-scroll mr-3">
              <h2 className="text-2xl font-medium leading-6 text-gray-900">
                {order.brand} {order.deviceCommercialName} ({order.deviceTechName})
              </h2>
              <p className="my-2"><b>Serie:</b> {order.deviceSerial}</p>
              <div>
                <p><b>Descripcion inicial del problema:</b></p>
                <p className="border border-gray-300 p-3 rounded min-h-20">{order.observation}</p>
              </div>
              <div className="my-2">attachments</div>
              <div className="my-2">presupuesto</div>
              <Comments orderId={order.$id} comments={order.comments?.length ? order.comments : []}/>
            </div>
            <div className="basis-1/4">
              <p>Estado: {order.status}</p>
              <div className="border border-gray-300 p-3 rounded mt-4">
                <p className="my-2">Fecha de entrada: {order.createdAtDate?.toDateString()} {order.createdAtDate?.toLocaleTimeString()}</p>
                <p className="my-2">Cliente: {order.customerFullName}</p>
                <p className="my-2">Whatsap: <a target="_blank" href={`https://wa.me/${order.customerPhone}`}>whatsap</a></p>
                <p className="my-2">Tecnico: Usuario</p>
                <p className="my-2">Vendedor: Usuario</p>
              </div>
              <div className="border border-gray-300 p-3 rounded mt-4">
                <p className="my-2">Desbloqueo: Codigo/patron</p>
                <p className="my-2">Validaciones: Usuario</p>
              </div>
            </div>
          </div>
      }
    </ModalLayout>
  )
}

export default ViewCardModal;