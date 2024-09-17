import { getOrders } from "@/services/orders";
import { updateStatus } from "@/services/updateStatus";
import { CountOperation, TypedColumn } from "@/types/enums";
import { create } from "zustand";

interface BoardStore {
  board: Board;
  getBoard: () => Promise<void>;
  setBoardState: (board: Board) => void;

  updateStatus: (taskId: string, columnId: TypedColumn) => void;
  refreshCommentCount: (orderId: string, operation: CountOperation) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async () => {
    const board = await getOrders();
    set({ board });
  },

  setBoardState: (board: Board) => set({ board }),
  updateStatus: async (taskId: string, columnId: TypedColumn) => {
    await updateStatus(taskId, columnId);
  },

  refreshCommentCount: (orderId: string, operation: CountOperation) => set((state) => {
    const board = state.board;
    // Crear una copia del board para no mutar el estado directamente
    const newBoard = { ...board };
    newBoard.columns = new Map(newBoard.columns); // Crear una copia de las columnas

    for (const [key, column] of newBoard.columns.entries()) {
      const orderIndex = column.orders.findIndex(
        (order: Order) => order.$id === orderId,
      );
      if (orderIndex !== -1) {
        const order = column.orders[orderIndex];
        order.commentsQuantity += operation === CountOperation.Increment ? 1 : -1;
        column.orders = [...column.orders]; // Crear una copia de los pedidos para actualizar el estado
        column.orders[orderIndex] = order;
        newBoard.columns.set(key, column);
        break;
      }
    }

    return { board: newBoard };
  }),
}));
