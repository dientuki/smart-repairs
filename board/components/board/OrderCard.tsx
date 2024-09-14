'use client'

import { ChatBubbleOvalLeftEllipsisIcon, PaperClipIcon, CalendarIcon, ClockIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd"
import { Modal } from "@/components/modal";
import Icon from "@/components/Icon";
import { ViewCardModal}  from "@/components/viewCardModal";
import { TypedColumn } from "@/types/enums";

type Props = {
    order: Order,
    index: number,
    id: TypedColumn,
    innerRef: (element: HTMLElement | null) => void,
    draggableProps: DraggableProvidedDraggableProps,
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}
export const OrderCard = ({ order, index, id, innerRef, draggableProps, dragHandleProps }: Props) => {
  const openCard = () => Modal.open(ViewCardModal, { order: order.$id });

  return (
    <div
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        className="flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-white/5 dark:ring-white/10 overflow-hidden"
        draggable
        onClick={openCard}
        id={`${id}-${index}`}
    >
      <div className="relative w-full aspect-video bg-cover bg-no-repeat" style={{backgroundImage: `url(${order.deviceTypeImage})`}}>
        <img src={order.brandImage} alt={order.brand} className="absolute top-2 left-2 h-8 w-auto object-contain" />
        <div className="absolute bottom-2 right-2 text-base font-medium outline-none transition duration-75 bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white  px-2 py-1 rounded-lg ring-1 ring-gray-950/5 dark:ring-white/10 bg-opacity-55 dark:bg-opacity-55 ">
            {order.deviceCommercialName}
        </div>
      </div>
      <div className="flex flex-col gap-1 p-2 text-base text-gray-950 dark:text-white">
        <div className="font-semibold">{order.brand} {order.deviceCommercialName}</div>
        {order.deviceTechName && <div>{order.deviceType}: {order.deviceTechName}</div> }
        {order.deviceSerial && <div>Imei: {order.deviceSerial}</div> }
        <div className="flex flex-row gap-2"><Icon icon={IdentificationIcon} />{order.customerFullName}</div>
        <div className="flex gap-3">
          <div className="flex flex-row gap-2"><Icon icon={ChatBubbleOvalLeftEllipsisIcon} />{order.commentsQuantity}</div>
          <div className="flex flex-row gap-2"><Icon icon={PaperClipIcon} />0</div>
          <div className="flex flex-row gap-2"><Icon icon={CalendarIcon} />{order.createdAtDate.toLocaleDateString()}<Icon icon={ClockIcon} />{order.createdAtDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div>
            {order.observation}
        </div>
      </div>
    </div>
  )
}