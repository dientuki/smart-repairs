'use client'

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
        className="rounded-md bg-white space-y-2 drop-shadow-sm"
        draggable
    >
        <div className="flex justify-between items-center p-5">
            <p>{todo.title}</p>
        </div>

        {/* images */}
    </div>
  )
}

export default TodoCard