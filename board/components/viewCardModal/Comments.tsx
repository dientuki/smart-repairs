import { useState } from "react";
import { useBoardStore, useOrderStore, useUserStore } from "@/store";
import { Textarea } from "@headlessui/react";
import Avatar from "react-avatar";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import Icon from "@/components/Icon";
import { ActionButton } from "@/components/form";
import { useTranslation } from "react-i18next";
import { LockStatus } from "./LockStatus";
import { Comment } from "@/components/viewCardModal";

type Props = {
  orderId: string
  comments: OrderComment[]
}

export const Comments = ({ orderId, comments }: Props) => {
  const { board, setBoardState } = useBoardStore();
  const { user } = useUserStore();
  const { addComment, deleteComment } = useOrderStore();
  const [currentComments, setComments] = useState(comments);
  const [isPublic, setIsPublic] = useState(false);
  const [text, setText] = useState('');
  const { t } = useTranslation();

  const toogleVisibility = () => setIsPublic(!isPublic);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const saveComment = async() => {
    if (text === '') return;

    const newComment: NewOrderComment = {
      orderId: orderId,
      comment: text,
      isPublic: isPublic,
    };

    const comment = await addComment(newComment);
    setComments(currentComments => [...currentComments, comment]);

    for (const [key, column] of board.columns.entries()) {
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

    for (const [key, column] of board.columns.entries()) {
      const order = column.orders.findIndex((order: Order) => order.$id === orderId);
      if (order != -1) {
        board.columns.get(key).orders[order].commentsQuantity--;
        setBoardState(board);
        break;
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <Icon size={7} icon={ChatBubbleOvalLeftEllipsisIcon} />
          <span className="text-1xl font-bold tracking-tight sm:text-2xl">{t('comments')} ({currentComments.length})</span>
        </div>
        <div>Button</div>
      </div>



        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
              <Avatar name={user?.name} round={true} size="28" maxInitials={2} src={user?.imageUrl} />
              <div className="w-full flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 overflow-hidden">
                <Textarea
                  className="block h-full w-full border-none bg-transparent px-3 py-1.5 text-base text-gray-950 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500  dark:text-white dark:placeholder:text-gray-500 dark:disabled:text-gray-400    "
                  name="description" onChange={handleChange} defaultValue={text}
                />
              </div>
          </div>
          <div className="flex items-center gap-2 ml-9">
            <ActionButton
              onClick={saveComment}>
                { t('button.save') }
            </ActionButton>
            <LockStatus toggleVisibility={toogleVisibility} status={isPublic} />
          </div>

        </div>

        <div className="flex flex-col gap-2 mt-4">
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