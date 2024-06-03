import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { useModalWindow } from "react-modal-global";
import { useBoardStore } from "@/store/BoardStore";
import { Textarea } from '@headlessui/react'
import Comments from "@/components/Comments";
import { useEffect } from "react";
import ModalLayout from "@/components/modal/ModalLayout";

type ModalParams = {
  order: string;
};

function ViewCardModal() {
  const modal = useModalWindow<ModalParams>();
  const { order, getOrder } = useBoardStore();
  let date:Date;

  useEffect(() => {
    getOrder(modal.params.order)
  }, [getOrder]);

  if (order) {
    date = new Date(order.createdAt);
  }

  return (
    <ModalLayout>
      {order &&
        <>
          <h2 className="text-2xl font-medium leading-6 text-gray-900">
            {order.brand} {order.deviceCommercialName} ({order.deviceTechName})
          </h2>
          <div className="flex flex-row">
            <div className="basis-3/4">
              <p><b>Serie:</b> {order.deviceSerial}</p>
              <div>
                <p><b>Descripcion inicial del problema:</b></p>
                {order.observation}
              </div>

              <Textarea name="description" />
              <Comments comments={order.comments?.length ? order.comments : []}/>
            </div>
            <div className="basis-1/4">
              <p>Fecha: {date.toLocaleDateString()} {date.toLocaleTimeString()}</p>
              <p>Cliente: {order.customerFullName}</p>
              <p>Estado: {order.status}</p>
            </div>
          </div>
        </>
      }
    </ModalLayout>
  )
}

export default ViewCardModal;