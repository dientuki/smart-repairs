import Avatar from "react-avatar";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ActionButton, TextareaField } from "../form";
import { capitalizeFirstLetter } from "@/helper/stringHelpers";
import { useState } from "react";
import { LockStatus } from "@/components/viewCardModal";
import { StyleColor } from "@/types/enums";

type Props = {
  comment: OrderComment;
};

export const Comment = ({ comment }: Props) => {
  const [commentData, setCommentData] = useState(comment);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      comment: commentData.comment,
      ispublic: commentData.isPublic,
    },
  });

  const handleRegistration = async (data: FieldValues) => {

  };

  const handleError = () => {
    toast.error(t("toast.error.form"));
  };

  const registerOptions = {
    comment: {
      required: t("validation.required", { field: t("field.comment") }),
    },
    ispublic: {},
  };

  const toggleVisibility = () => {
    //setValue("ispublic", !ispublic); // Cambiar el valor de ispublic
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
        />
      </div>
      <form
        onSubmit={handleSubmit(handleRegistration, handleError)}
        className='w-auto ml-9'
      >
        <TextareaField
          name='comment'
          label={t("field.comment")}
          labelless
          control={control}
          rules={registerOptions.comment}
          errors={errors}
          rows={2}
          placeholder={capitalizeFirstLetter(t("placeholder.comment"))}
        />
      </form>
      <div className='flex flex-row items-center gap-3 w-auto ml-9'>
          {isEditing ? (
            <ActionButton onClick={toggleVisibility}>
              {t("button.save")}
            </ActionButton>
          ) : (
            <ActionButton onClick={toggleVisibility}>
              {t("button.edit")}
            </ActionButton>
          )}
          <ActionButton style={StyleColor.Danger}>
            {t("button.delete")}
          </ActionButton>
        </div>
    </div>
  );
};
