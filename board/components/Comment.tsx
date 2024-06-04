import { useOrderStore } from "@/store/OrderStore";
import { Textarea } from "@headlessui/react";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Avatar from 'react-avatar';


type Props = {
  comment: OrderComment,
  onDelete: MouseEventHandler<HTMLDivElement>
}

function Comment({ comment, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [commentData, setCommentData] = useState(comment);
  const { updateCommentVisibility, updateComment } = useOrderStore();
  let text = commentData.comment;

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
  };

  return (
    <div>
        <div className="flex items-center gap-3">
            <Avatar name={commentData.userName} round={true} size="36" />

            <div>{commentData.createdAtDate?.toDateString()} {commentData.createdAtDate?.toLocaleTimeString()}</div>

            <div className="cursor-pointer" onClick={toogleVisibility} >{commentData.isPublic ?
              <><LockOpenIcon className="h-4 w-4 inline-block" /> Publico</>:
              <><LockClosedIcon className="h-4 w-4 inline-block" /> Privado</>
            }
            </div>

        </div>

        <div className="ml-12">
          <Textarea
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue={commentData.comment}
            onClick={editComment}
            onChange={handleChange}
          />
          <div className="mt-2 flex items-center gap-3">
              { isEditing ? <div className="cursor-pointer" onClick={saveComment}>Guardar</div> : <div className="cursor-pointer" onClick={editComment}>Editar</div>}
              <div className="cursor-pointer" onClick={onDelete}>Borrar</div>
          </div>

        </div>


    </div>
  )
};

export default Comment