import { create } from 'zustand'
import { getOrder, getOrderCreationData } from "@/lib/orders";
import { addComment, updateCommentVisibility, updateComment, deleteComment } from "@/lib/comments";
import { createOrder } from "@/lib/orders";

interface OrderStore {
    order: Order,
    getOrder: (id: string) => Promise<void>,

    updateCommentVisibility: (commentId: string, isPublic: boolean) => void
    updateComment: (commentId: string, text: string) => void,
    deleteComment: (commentId: string) => void,
    addComment: (newComment:NewOrderComment) => Promise<OrderComment>

    data: any,
    getOrderCreationData: () => Promise<void>

    addOrder: (newOrder: NewOrder) => Promise<void>,
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: {} as Order,
  getOrder: async(id: string) => {
    const order = await getOrder(id);
    set({ order });
  },

  updateCommentVisibility: (commentId: string, isPublic: boolean) => {
    updateCommentVisibility(commentId, isPublic);
  },

  updateComment: (commentId: string, text: string) => {
    updateComment(commentId, text);
  },

  deleteComment: async (commentId: string) => {
    await deleteComment(commentId);
  },

  addComment: async (newComment:NewOrderComment) => {
    return await addComment(newComment);
  },

  data: {} as any,
  getOrderCreationData: async () => {
    const data = await getOrderCreationData();
    set({ data });
  },


  addOrder: async (newOrder: NewOrder): Promise<void> => {
    return await createOrder(newOrder);
  }
}));