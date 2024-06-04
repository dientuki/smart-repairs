import { useOrderStore } from "@/store/OrderStore";
import { Textarea } from "@headlessui/react";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Avatar from 'react-avatar';


type Props = {
  comment: OrderComment,
  onDelete: React.MouseEventHandler<HTMLButtonElement>
}

function Comment({ comment, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [commentData, setCommentData] = useState(comment);
  const { updateCommentVisibility, updateComment } = useOrderStore();
  let text:string = commentData.comment;

  const toogleVisibility = () => {
    updateCommentVisibility(comment.id, !commentData.isPublic);
    setCommentData({
      ...commentData,
      isPublic: !commentData.isPublic,
      comment: text
    });
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    text = event.target.value;
  };

  const editComment = () => {
    setIsEditing(true);
  };

  const saveComment = () => {
    setIsEditing(false);
    updateComment(comment.id, text);
    setCommentData({
      ...commentData,
      wasEdited: true,
    });
  };

  return (
    <div>
        <div className="flex items-center gap-3">
            <Avatar name={commentData.userName} round={true} size="36" />

            <div>{commentData.createdAtDate?.toDateString()} {commentData.createdAtDate?.toLocaleTimeString()}</div>

            {commentData.wasEdited && <div className="text-gray-500">Editado</div>}

            <div className="cursor-pointer" onClick={toogleVisibility} >{commentData.isPublic ?
              <><LockOpenIcon className="h-4 w-4 inline-block" /> Publico</>:
              <><LockClosedIcon className="h-4 w-4 inline-block" /> Privado</>
            }
            </div>

        </div>

        <div className="ml-12">
          <Textarea
            className="w-full p-2 border border-gray-300 rounded h-auto"
            defaultValue={commentData.comment}
            onClick={editComment}
            onChange={handleChange}
          />
          <div className="mt-2 flex items-center gap-3">
              { isEditing ?
                <button className="rounded-md bg-sky-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" onClick={saveComment}>Guardar</button> :
                <button className="rounded-md bg-sky-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" onClick={editComment}>Editar</button>}
              <button className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" onClick={onDelete}>Borrar</button>
          </div>

        </div>


    </div>
  )
};

export default Comment