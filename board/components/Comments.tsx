import { useState } from "react";
import Comment from "./Comment";
import { useBoardStore } from "@/store/BoardStore";
import { useOrderStore } from "@/store/OrderStore";
import { Textarea } from "@headlessui/react";
import Avatar from "react-avatar";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";

type Props = {
  orderId: string
  comments: OrderComment[]
}

function Comments({ orderId, comments }: Props) {
  const { board, setBoardState } = useBoardStore();
  const { addComment, deleteComment } = useOrderStore();
  const [currentComments, setComments] = useState(comments);
  const [isPublic, setIsPublic] = useState(false);
  const [text, setText] = useState('');

  const toogleVisibility = () => setIsPublic(!isPublic);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const saveComment = async() => {
    if (text === '') return;

    const newComment:NewOrderComment = {
      orderId: orderId,
      comment: text,
      isPublic: isPublic,
    };

    const comment = await addComment(newComment);
    setComments(currentComments => [...currentComments, comment]);

    for (let [key, column] of board.columns.entries()) {
      const order = column.orders.findIndex((order: Order) => order.$id === orderId);
      if (order != -1) {
        board.columns.get(key).orders[order].commentsQuantity++;
        setBoardState(board);
        break;
      }
    }

    setText('agga');
    setIsPublic(false);
  }

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

        <div className="bg-yellow-200 py-2 px-1 rounded">
          <div className="flex items-center gap-3">
              <Avatar name="Juan Farias" round={true} size="36" />
              <Textarea className="w-full p-2 border border-gray-300 rounded h-auto" name="description" onChange={handleChange} defaultValue={text} />
          </div>
          <div className="flex items-center gap-3 ml-12 mt-2">
            <button className="rounded-md bg-sky-600 px-3 py-1.5 text-base font-bold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" onClick={saveComment}>Guardar</button>
            <div className="cursor-pointer" onClick={toogleVisibility} >{isPublic ?
                <><LockOpenIcon className="h-4 w-4 inline-block" /> Publico</>:
                <><LockClosedIcon className="h-4 w-4 inline-block" /> Privado</>
              }
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-5 mt-3">
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