import { Icon } from "@/components/Icon";
import { useOrderStore } from "@/store";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { AddComment, Comment } from "@/components/viewCardModal";
import { capitalizeFirstLetter } from "@/helper/stringHelpers";

export const Comments = () => {
  const { order } = useOrderStore();
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row justify-between items-center h-9'>
        <div className='flex flex-row items-center gap-2'>
          <Icon size={7} icon={ChatBubbleOvalLeftEllipsisIcon} />
          <span className='text-1xl font-bold tracking-tight sm:text-2xl'>
            {capitalizeFirstLetter(t("order.comments"))} (
            {order?.comments?.length || 0})
          </span>
        </div>
      </div>

      <AddComment />
      <div className='flex flex-col gap-2 mt-4'>
        {order?.comments?.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
