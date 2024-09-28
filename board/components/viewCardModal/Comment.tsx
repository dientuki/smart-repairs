import Avatar from "react-avatar";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "@/helper/stringHelpers";
import { useRef, useState } from "react";
import { LockStatus } from "@/components/viewCardModal";
import { useOrderStore, useUserStore } from "@/store";
import { simpleError } from "@/helper/toastHelper";
import {
  ActionButtonWithDialog,
  ActionButton,
  TextareaField,
} from "@/components/form";

type Props = {
  comment: OrderComment;
};

export const Comment = ({ comment }: Props) => {
  const { user } = useUserStore();
  const { updateComment, deleteComment } = useOrderStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMyComment = comment.userId === user?.id;
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      comment: comment.comment,
      ispublic: comment.isPublic,
    },
  });
  const ispublic = watch("ispublic");
  const formRef = useRef<HTMLFormElement>(null);

  const isEqualOrderComment = (
    obj1: FieldValues,
    obj2: OrderComment,
  ): boolean => {
    return obj1.comment === obj2.comment && obj1.ispublic === obj2.isPublic;
  };

  const handleRegistration = async (data: FieldValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const status = await updateComment(
        comment.id,
        data as CreateOrUpdateComment,
      );
      if (status) {
        toast.success(
          t("toast.success.update", {
            record: t("order.comment"),
          }),
        );
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

  const handleDeleteClick = async () => {
    try {
      const status = await deleteComment(comment.id);
      if (status) {
        toast.success(
          t("toast.success.delete", {
            record: t("order.comment"),
          }),
        );
      } else {
        toast.error(
          t("toast.error.delete", {
            record: t("order.comment"),
          }),
        );
      }
    } catch (e: unknown) {
      toast.error(t(`toast.error.${simpleError(e)}`));
    }
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
          name={comment.userName}
          round={true}
          size='28'
          maxInitials={2}
          src={comment.userImage}
        />
        <div>
          {comment.createdAtDate?.toDateString()}{" "}
          {comment.createdAtDate?.toLocaleTimeString()}
        </div>

        {comment.wasEdited && <div className='text-gray-500'>Editado</div>}

        <LockStatus
          toggleVisibility={toggleVisibility}
          status={comment.isPublic}
          disabled={!isMyComment}
          isSubmitting={isSubmitting}
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
          <ActionButtonWithDialog
            style={StyleColor.Danger}
            record={t("order.comment")}
            onConfirm={handleDeleteClick}
          >
            {t("button.delete")}
          </ActionButtonWithDialog>
        </div>
      )}
    </div>
  );
};
