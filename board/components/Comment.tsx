import { useOrderStore } from "@/store/OrderStore";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Avatar from 'react-avatar';


type Props = {
  comment: OrderComment
}

function Comment({ comment }: Props) {
  const [commentData, setCommentData] = useState(comment);
  const { updateCommentVisibility } = useOrderStore();

  const handleClick = () => {
    updateCommentVisibility(comment.id, !commentData.isPublic);
    setCommentData({ ...commentData, isPublic: !commentData.isPublic });
  }

  return (
    <div>
        <div className="flex items-center gap-3">
            <Avatar name={commentData.userName} round={true} size="36" />

            <div>{commentData.createdAtDate?.toDateString()} {commentData.createdAtDate?.toLocaleTimeString()}</div>

            <div className="cursor-pointer" onClick={handleClick} >{commentData.isPublic ?
              <><LockOpenIcon className="h-4 w-4 inline-block" /> Publico</>:
              <><LockClosedIcon className="h-4 w-4 inline-block" /> Privado</>
            }
            </div>
        </div>
        <div className="ml-12">{commentData.comment}</div>
    </div>
  )
};

export default Comment