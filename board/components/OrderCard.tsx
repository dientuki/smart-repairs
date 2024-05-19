'use client'

import { ChatBubbleOvalLeftEllipsisIcon, PaperClipIcon, CalendarIcon } from "@heroicons/react/20/solid";
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd"
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";

type Props = {
    order: Order,
    index: number,
    id: TypedColumn,
    innerRef: (element: HTMLElement | null) => void,
    draggableProps: DraggableProvidedDraggableProps,
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}
function OrderCard({ order, index, id, innerRef, draggableProps, dragHandleProps }: Props) {
  const { getOrder } = useBoardStore();
  const openModal = useModalStore((state) => state.openModal);

  return (
    <div
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        className="flex flex-col rounded-md bg-white drop-shadow-sm overflow-hidden"
        draggable
        onClick={(e) => {
            // open modal
            getOrder(order.$id);
            openModal();
        }}
    >
      <div className="relative w-full aspect-video bg-cover bg-no-repeat" style={{backgroundImage: `url(${order.deviceTypeImage})`}}>
        <img src={order.brandImage} alt={order.brand} className="absolute top-2 left-2 h-8 w-auto object-contain" />
        <div className="absolute bottom-2 right-2 text-base text-white bg-gray-800/50  px-1 py-0.5 rounded">
            {order.deviceCommercialName}
        </div>
      </div>
      <div className="p-1 flex-col mt-2">
        <div>{order.brand} {order.deviceCommercialName}</div>
        <div>{order.deviceType}: {order.deviceTechName}</div>
        <div>Imei: {order.deviceSerial}</div>
        <div>Customer: {order.customerFullName}</div>
        <div className="flex justify-between">
          <div><ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 inline-block" />8</div>
          <div><PaperClipIcon className="h-4 w-4 inline-block" />8</div>
          <div><CalendarIcon className="h-4 w-4 inline-block" />{order.createdAt}</div>
        </div>
        <div>
            {order.observation}
        </div>
      </div>
    </div>
  )
}

export default OrderCard