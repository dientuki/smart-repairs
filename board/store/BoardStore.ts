import { getOrders } from "@/lib/orders";
import { updateStatus } from "@/lib/updateStatus";
import { create } from 'zustand'

interface BoardStore {
    board: Board,
    getBoard: () => Promise<void>,
    setBoardState: (board: Board) => void,

    updateStatus: (taskId: string, columnId: TypedColumn) => void,
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async() => {
    const board = await getOrders();
    set({ board });
  },

  setBoardState: (board: Board) => set({ board }),
  updateStatus: async (taskId: string , columnId: TypedColumn) => {
    await updateStatus(taskId, columnId);
  }

}));