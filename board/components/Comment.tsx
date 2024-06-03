import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/20/solid";
import Avatar from 'react-avatar';

type Props = {
  comment: OrderComment
}

function Comment({ comment }: Props) {

  return (
    <div>
        <div className="flex items-center gap-3">
            <Avatar name={comment.userName} round={true} size="36" />

            <div>{comment.createdAtDate?.toDateString()} {comment.createdAtDate?.toLocaleTimeString()}</div>

            {comment.isPublic ?
              <><LockOpenIcon className="h-4 w-4 inline-block" /> Publico</>:
              <><LockClosedIcon className="h-4 w-4 inline-block" /> Privado</>
            }
        </div>
        <div className="ml-12">{comment.comment}</div>
    </div>
  )
};

export default Comment