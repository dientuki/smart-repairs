import { getOrder } from "@/lib/getOrder";
import { updateCommentVisibility, updateComment } from "@/lib/comments";
import { create } from 'zustand'

interface OrderStore {
    order: Order,
    getOrder: (id: string) => void,

    updateCommentVisibility: (commentId: string, isPublic: boolean) => void
    updateComment: (commentId: string, text: string) => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: {} as Order,
  getOrder: async(id: string) => {
    const order = await getOrder(id);
    set({ order });
  },

  updateCommentVisibility: async (commentId: string, isPublic: boolean) => {
    await updateCommentVisibility(commentId, isPublic);
  },

  updateComment: async (commentId: string, text: string) => {
    await updateComment(commentId, text);
  }
}));