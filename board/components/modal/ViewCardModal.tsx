import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { useModalWindow } from "react-modal-global";
import { useOrderStore } from "@/store/OrderStore";
import { Textarea } from '@headlessui/react'
import Comments from "@/components/Comments";
import { useEffect } from "react";
import ModalLayout from "@/components/modal/ModalLayout";
import { DNA } from "react-loader-spinner";

type ModalParams = {
  order: string;
};

function ViewCardModal() {
  const modal = useModalWindow<ModalParams>();
  const { order, getOrder } = useOrderStore();

  useEffect(() => {
    getOrder(modal.params.order);
  }, [getOrder]);

  return (
    <ModalLayout>
      {(modal.params.order == order.$id) ?
        <>
          <div className="flex flex-row">
            <div className="basis-3/4">
              <h2 className="text-2xl font-medium leading-6 text-gray-900">
                {order.brand} {order.deviceCommercialName} ({order.deviceTechName})
              </h2>
              <p><b>Serie:</b> {order.deviceSerial}</p>
              <div>
                <p><b>Descripcion inicial del problema:</b></p>
                {order.observation}
              </div>
              <Comments comments={order.comments?.length ? order.comments : []}/>
              <Textarea name="description" />
            </div>
            <div className="basis-1/4">
              <p>Estado: {order.status}</p>
              <p>Fecha de entrada: {order.createdAtDate?.toDateString()} {order.createdAtDate?.toLocaleTimeString()}</p>
              <p>Cliente: {order.customerFullName}</p>
              <p>Tecnico: Usuario</p>
              <p>Reportado: Usuario</p>
            </div>
          </div>
        </>
        : <DNA
        visible={true}
        height="120"
        width="120"
        ariaLabel="dna-loading"
        wrapperClass="dna-wrapper m-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      }
    </ModalLayout>
  )
}

export default ViewCardModal;