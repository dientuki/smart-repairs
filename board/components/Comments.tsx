import { useState } from "react";
import Comment from "./Comment";
import { useBoardStore } from "@/store/BoardStore";
import { useOrderStore } from "@/store/OrderStore";

type Props = {
  orderId: string
  comments: OrderComment[]
}

function Comments({ orderId, comments }: Props) {
  const { board, setBoardState } = useBoardStore();
  const { deleteComment } = useOrderStore();
  const [currentComments, setComments] = useState(comments);

  const onDelete = (id: string) => {
    setComments(currentComments => currentComments.filter(comment => comment.id !== id));
    deleteComment(id);

    for (let [key, column] of board.columns.entries()) {
      const order = column.orders.findIndex((order: Order) => order.$id === orderId);
      if (order != -1) {
        board.columns.get(key).orders[order].commentsQuantity--;
        setBoardState(board);
        break;
      }
    }
  };

  return (
    <div>
        <h3 className="mb-2 text-xl font-medium">Comentarios ({currentComments.length})</h3>
        <div className="flex flex-col gap-5">
          {currentComments && currentComments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onDelete={() => onDelete(comment.id)}
              />
          ))}
        </div>
    </div>
  )
}

export default Comments