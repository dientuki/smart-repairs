import { uploadTask } from "@/lib/addTask";
import { getTodosGroupedByColumns } from "@/lib/getTodosGroupedByColumns";
import { getOrder } from "@/lib/getOrder";
import { updateStatus } from "@/lib/updateStatus";
import { create } from 'zustand'

interface BoardStore {
    board: Board,
    getBoard: () => void,
    setBoardState: (board: Board) => void,

    updateStatus: (taskId: number, columnId: TypedColumn) => void,

    order: Todo,
    getOrder: (id: number) => void,
    cleanOrder: () => void,

    newTaskInput: string,
    setNewTaskInput: (input: string) => void,

    image: File | null,
    setImage: (image: File | null) => void,

    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async() => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },
  setBoardState: (board: Board) => set({ board }),
  updateStatus: async (taskId: number , columnId: TypedColumn) => {
    await updateStatus(taskId, columnId);
  },

  order: {} as Todo,
  getOrder: async(id: number) => {
    const order = await getOrder(id);
    set({ order });
  },
  cleanOrder: () => set({ order: {} as Todo }),

  newTaskInput: "",
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),

  image: null,
  setImage: (image: File | null) => set({ image }),

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: File | undefined;

    const id = await uploadTask(todo, columnId, file);

    set( {newTaskInput: ""});

    set((state) => {

      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id: id,
        createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file })
      }

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo]
        });
      } else {
        newColumns.set(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns
        }
      }

    });

  }

}));