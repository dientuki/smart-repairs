'use client';

import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from "@/components/Column";

function Board() {
  const { board, getBoard, setBoardState, updateStatus } = useBoardStore();

  useEffect(() => {
    getBoard()
  }, [getBoard]);


  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;


    // if destination is null, return early
    // this happens when the user stops dragging outside of a droppable
    if (!destination) return;

    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos
    }

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos
    }

    if (!startCol || !finishCol) return;
    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);
    let newColumns: Map<TypedColumn, Column>;

    if (startCol.id === finishCol.id) {
      //same column move
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos
      }
      newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
    } else {
      //different column move
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos
      }

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos
      })

      // update status
      updateStatus(todoMoved.$id, finishCol.id);
    }

    // update board
    setBoardState({ ...board, columns: newColumns });
  }

  return <DragDropContext onDragEnd={handleOnDragEnd}>
    <Droppable droppableId="board" direction="horizontal" type="column">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="grid grid-cols-3 gap-5 max-w-full mx-8"
        >{Array.from(board.columns.entries()).map(([id, column], index) => (
          <Column
            key={id}
            id={id}
            todos={column.todos}
            index={index}
          />
        ))}

        </div>
      )}
    </Droppable>
  </DragDropContext>
}

export default Board