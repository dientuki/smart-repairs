import { uploadTask } from "@/lib/addTask";
import { getOrdersGroupedByColumns } from "@/lib/getOrdersGroupedByColumns";
import { updateStatus } from "@/lib/updateStatus";
import { create } from 'zustand'

interface BoardStore {
    board: Board,
    getBoard: () => void,
    setBoardState: (board: Board) => void,

    updateStatus: (taskId: string, columnId: TypedColumn) => void,

    newTaskInput: string,
    setNewTaskInput: (input: string) => void,

    image: File | null,
    setImage: (image: File | null) => void,

    addTask: (order: string, columnId: TypedColumn, image?: File | null) => void
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async() => {
    const board = await getOrdersGroupedByColumns();
    set({ board });
  },
  setBoardState: (board: Board) => set({ board }),
  updateStatus: async (taskId: string , columnId: TypedColumn) => {
    await updateStatus(taskId, columnId);
  },

  newTaskInput: "",
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),

  image: null,
  setImage: (image: File | null) => set({ image }),

  addTask: async (order: string, columnId: TypedColumn, image?: File | null) => {
    let file: File | undefined;

    const id = await uploadTask(order, columnId, file);

    set( {newTaskInput: ""});

    set((state) => {

      const newColumns = new Map(state.board.columns);

      const newOrder: Order = {
        $id: id,
        createdAt: new Date().toISOString(),
        title: order,
        status: columnId,
        ...(file && { image: file })
      }

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          orders: [newOrder]
        });
      } else {
        newColumns.set(columnId)?.orders.push(newOrder);
      }

      return {
        board: {
          columns: newColumns
        }
      }

    });

  }

}));