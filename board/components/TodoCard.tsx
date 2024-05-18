'use client'

import { ChatBubbleOvalLeftEllipsisIcon, PaperClipIcon, CalendarIcon } from "@heroicons/react/20/solid";
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd"

type Props = {
    todo: Todo,
    index: number,
    id: TypedColumn,
    innerRef: (element: HTMLElement | null) => void,
    draggableProps: DraggableProvidedDraggableProps,
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}
function TodoCard({ todo, index, id, innerRef, draggableProps, dragHandleProps }: Props) {
  return (
    <div
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        className="flex flex-col rounded-md bg-white drop-shadow-sm overflow-hidden"
        draggable
        onClick={() => {
            // open modal
            console.log('todo card clicked')
        }}
    >
      <div className="relative w-full aspect-video bg-cover bg-no-repeat" style={{backgroundImage: `url(${todo.deviceTypeImage})`}}>
        <img src={todo.brandImage} alt={todo.brand} className="absolute top-2 left-2 h-8 w-auto object-contain" />
        <div className="absolute bottom-2 right-2 text-base text-white bg-gray-800/50  px-1 py-0.5 rounded">
            {todo.deviceCommercialName}
        </div>
      </div>
      <div className="p-1 flex-col mt-2">
        <div>{todo.brand} {todo.deviceCommercialName}</div>
        <div>{todo.deviceType}: {todo.deviceTechName}</div>
        <div>Imei: {todo.deviceSerial}</div>
        <div>Customer: {todo.customerFullName}</div>
        <div className="flex justify-between">
          <div><ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 inline-block" />8</div>
          <div><PaperClipIcon className="h-4 w-4 inline-block" />8</div>
          <div><CalendarIcon className="h-4 w-4 inline-block" />{todo.createdAt}</div>
        </div>
        <div>
            {todo.observation}
        </div>
      </div>
    </div>
  )
}

export default TodoCard