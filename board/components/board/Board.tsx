"use client";

import { useBoardStore, useUserStore } from "@/store";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { Column } from "@/components/board";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { TypedColumn } from "@/types/enums";

export const Board = () => {
  const { board, getBoard, setBoardState, updateStatus } = useBoardStore();
  const { getCurrentUser } = useUserStore();
  const { t } = useTranslation();

  useEffect(() => {
    getBoard().catch((e: any) => {
      console.log(e.message);
      toast.error(t(`toast.error.${e.message}`));
    });
  }, [getBoard]);

  useEffect(() => {
    getCurrentUser().catch((e: any) => {
      console.log(e.message);
      toast.error(t(`toast.error.${e.message}`));
    });
  }, []);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // if destination is null, return early
    // this happens when the user stops dragging outside of a droppable
    if (!destination) return;

    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      orders: startColIndex[1].orders,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      orders: finishColIndex[1].orders,
    };

    if (!startCol || !finishCol) return;
    if (source.index === destination.index && startCol === finishCol) return;

    const newOrders = startCol.orders;
    const [orderMoved] = newOrders.splice(source.index, 1);
    let newColumns: Map<TypedColumn, Column>;

    if (startCol.id === finishCol.id) {
      //same column move
      newOrders.splice(destination.index, 0, orderMoved);
      const newCol = {
        id: startCol.id,
        orders: newOrders,
      };
      newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
    } else {
      //different column move
      const finishOrders = Array.from(finishCol.orders);
      finishOrders.splice(destination.index, 0, orderMoved);

      newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        orders: newOrders,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        orders: finishOrders,
      });

      // update status
      updateStatus(orderMoved.$id, finishCol.id);
    }

    // update board
    setBoardState({ ...board, columns: newColumns });
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='grid grid-cols-6 gap-2 w-full min-h-full'
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} orders={column.orders} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
