import { useState } from "react";
import Comment from "./Comment";
import { useBoardStore } from "@/store/BoardStore";

type Props = {
  orderId: string
  comments: OrderComment[]
}

function Comments({ orderId, comments }: Props) {
  const { board, setBoardState } = useBoardStore();
  const [currentComments, setComments] = useState(comments);

  const deleteComment = (id: string) => {
    setComments(currentComments => currentComments.filter(comment => comment.id !== id));

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
                onDelete={() => deleteComment(comment.id)}
              />
          ))}
        </div>
    </div>
  )
}

export default Comments