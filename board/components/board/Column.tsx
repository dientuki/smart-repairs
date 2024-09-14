import { Draggable, Droppable } from "react-beautiful-dnd"
import { OrderCard } from "@/components/board"
import { StyleColor, TypedColumn } from "@/types/enums"
import { useTranslation } from "react-i18next"
import { dynamicStyles } from "@/helper/componentsHelpers"

type Props = {
    id: TypedColumn,
    orders: Order[],
    index: number
}

export const Column = ( { id, orders, index }: Props ) => {
  const { t } = useTranslation();
  return (
    <Draggable key={id} draggableId={id} index={index} isDragDisabled={true}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="relative overflow-hidden rounded-lg outline-none transition duration-75 hover:bg-gray-50 dark:hover:bg-white/5 focus-visible:bg-gray-100 dark:focus-visible:bg-white/5 bg-white dark:bg-gray-900 ring-1 ring-gray-950/5 dark:ring-white/10"
          >
            {/* order list */}
            <Droppable droppableId={index.toString()} type="card" direction="vertical">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={` ${snapshot.isDraggingOver ? "bg-green-200" : "bg-red-200"} h-full` }
                >
                    <div className="relative flex items-center justify-between gap-x-3 rounded-t-lg py-2 px-3 outline-none transition duration-75 bg-gray-50 dark:bg-white/5">
                      <h2 className="fi-ta-header-heading text-base font-semibold leading-6 text-gray-950 dark:text-white">
                          {t(`status.${id}`)}
                      </h2>
                      <span style={dynamicStyles(StyleColor.Info)} className="flex items-center justify-center gap-x-1 rounded-md text-xs font-medium ring-1 ring-inset px-2 min-w-[theme(spacing.6)] py-1 fi-color-custom bg-custom-50 text-custom-600 ring-custom-600/10 dark:bg-custom-400/10 dark:text-custom-400 dark:ring-custom-400/30 fi-color-primary">{orders.length}</span>
                    </div>
                    <div className="space-y-2 p-2 border-t border-gray-200 dark:border-white/10">
                        {orders.map((order, index) => (
                            <Draggable
                                key={order.$id}
                                draggableId={order.$id}
                                index={index}
                            >
                                {(provided) => (
                                    <OrderCard
                                        order={order}
                                        index={index}
                                        id={id}
                                        innerRef={provided.innerRef}
                                        draggableProps={provided.draggableProps}
                                        dragHandleProps={provided.dragHandleProps}
                                    />
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}

                    </div>
                </div>
              )}
            </Droppable>
          </div>
        )}
    </Draggable>
  )
}