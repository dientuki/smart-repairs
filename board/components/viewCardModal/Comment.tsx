import { useOrderStore } from "@/store/OrderStore";
import { Textarea } from "@headlessui/react";
import { useState } from "react";
import Avatar from 'react-avatar';
import { ActionButton } from "@/components/form";
import { useTranslation } from "react-i18next";
import { StyleColor } from "@/types/enums";
import { LockStatus } from "@/components/viewCardModal";


type Props = {
  comment: OrderComment,
  onDelete: React.MouseEventHandler<HTMLButtonElement>
}

export const Comment = ({ comment, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [commentData, setCommentData] = useState(comment);
  const { updateCommentVisibility, updateComment } = useOrderStore();
  const { t } = useTranslation();
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
    <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2">

            <Avatar name={commentData.userName} round={true} size="28" maxInitials={2} src={commentData.userImage} />

            <div>{commentData.createdAtDate?.toDateString()} {commentData.createdAtDate?.toLocaleTimeString()}</div>

            {commentData.wasEdited && <div className="text-gray-500">Editado</div>}

            <LockStatus toggleVisibility={toogleVisibility} status={commentData.isPublic} />

        </div>

        <div className="flex flex-col gap-3 ml-9">
          <div className="flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 overflow-hidden">
            <Textarea
              className="block h-full w-full border-none bg-transparent px-3 py-1.5 text-base text-gray-950 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500  dark:text-white dark:placeholder:text-gray-500 dark:disabled:text-gray-400    "
              defaultValue={commentData.comment}
              onClick={editComment}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-row items-center gap-3">
              { isEditing ?
                <ActionButton
                  onClick={saveComment}>
                    { t('button.save') }
                </ActionButton> :
                <ActionButton
                  onClick={editComment}>
                    { t('button.edit') }
                </ActionButton>
              }
              <ActionButton
                onClick={onDelete}
                style={StyleColor.Danger}>
                  { t('button.delete') }
              </ActionButton>
          </div>

        </div>


    </div>
  )
};