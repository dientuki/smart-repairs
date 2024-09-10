import { Draggable, Droppable } from "react-beautiful-dnd"
import OrderCard from "@/components/board/OrderCard"

type Props = {
    id: TypedColumn,
    orders: Order[],
    index: number
}

const idToColumnText: {
    [key in TypedColumn]: string
} = {
    "for budgeting": "para presupuesto",
    budgeting: "presupuestando",
    budgeted: "presupuestado",
    "to do": "para reparar",
    repairing: "reparando",
    repaired: "reparado",
}

function Column( { id, orders, index }: Props ) {
  return (
    <Draggable key={id} draggableId={id} index={index} isDragDisabled={true}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {/* order list */}
            <Droppable droppableId={index.toString()} type="card" direction="vertical">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-2 rounded-2xl shadow-sm ${snapshot.isDraggingOver ? "bg-green-200" : "bg-gray-500/100"}`}
                >
                    <h2 className="flex justify-between text-xl font-bold p-2">
                        {idToColumnText[id]}
                        <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-base font-normal">{orders.length}</span>
                    </h2>
                    <div className="space-y-2">
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

export default Column