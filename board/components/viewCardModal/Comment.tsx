import Avatar from "react-avatar";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ActionButton, TextareaField } from "../form";
import { capitalizeFirstLetter } from "@/helper/stringHelpers";
import { useRef, useState } from "react";
import { LockStatus } from "@/components/viewCardModal";
import { StyleColor } from "@/types/enums";
import { useOrderStore, useUserStore } from "@/store";
import { simpleError } from "@/helper/toastHelper";

type Props = {
  comment: OrderComment;
};

export const Comment = ({ comment }: Props) => {
  const { user } = useUserStore();
  const { updateComment } = useOrderStore();
  const [commentData, setCommentData] = useState(comment);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMyComment = commentData.userId === user?.id;
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      comment: commentData.comment,
      ispublic: commentData.isPublic,
    },
  });
  const ispublic = watch("ispublic");
  const formRef = useRef<HTMLFormElement>(null);

  const handleRegistration = async (data: FieldValues) => {
    if (isSubmitting || data.comment === commentData.comment) return;
    setIsSubmitting(true);
    try {
      const status = await updateComment(
        commentData.id,
        data as CreateOrUpdateComment,
      );
      if (status) {
        toast.success(
          t("toast.success.add", {
            record: t("order.comment"),
          }),
        );
        if (data.comment === "") {
          setIsEditing(false);
        }
      } else {
        toast.error(
          t("toast.error.update", {
            record: t("order.comment"),
          }),
        );
      }
    } catch (e: unknown) {
      toast.error(t(`toast.error.${simpleError(e)}`));
    } finally {
      setIsEditing(false);
      setIsSubmitting(false);
    }
  };

  const handleError = () => {
    toast.error(t("toast.error.form"));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const registerOptions = {
    comment: {
      required: t("validation.required", { field: t("field.comment") }),
    },
    ispublic: {},
  };

  const toggleVisibility = () => {
    setValue("ispublic", !ispublic);
    submitForm();
  };

  const submitForm = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-2'>
        <Avatar
          name={commentData.userName}
          round={true}
          size='28'
          maxInitials={2}
          src={commentData.userImage}
        />
        <div>
          {commentData.createdAtDate?.toDateString()}{" "}
          {commentData.createdAtDate?.toLocaleTimeString()}
        </div>

        {commentData.wasEdited && <div className='text-gray-500'>Editado</div>}

        <LockStatus
          toggleVisibility={toggleVisibility}
          status={commentData.isPublic}
          disabled={!isMyComment}
        />
      </div>
      <form
        onSubmit={handleSubmit(handleRegistration, handleError)}
        className='w-auto ml-9'
        ref={formRef}
      >
        <TextareaField
          name='comment'
          label={t("field.comment")}
          labelless
          control={control}
          rules={registerOptions.comment}
          errors={errors}
          rows={2}
          disabled={!isMyComment}
          placeholder={capitalizeFirstLetter(t("placeholder.comment"))}
          onClick={() => {
            if (isMyComment) {
              setIsEditing(true);
            }
          }}
        />
      </form>
      {isMyComment && (
        <div className='flex flex-row items-center gap-3 w-auto ml-9'>
          <ActionButton
            onClick={isEditing ? submitForm : handleEditClick}
            loading={isSubmitting}
          >
            {isEditing ? t("button.send") : t("button.edit")}
          </ActionButton>
          <ActionButton style={StyleColor.Danger}>
            {t("button.delete")}
          </ActionButton>
        </div>
      )}
    </div>
  );
};
