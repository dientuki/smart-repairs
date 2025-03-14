import { useOrderStore, useUserStore } from "@/store";
import Avatar from "react-avatar";
import { ActionButton, TextareaField } from "@/components/form";
import { useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Loading } from "@/components/Loading";
import { capitalizeFirstLetter } from "@/helper/stringHelpers";
import { simpleError } from "@/helper/toastHelper";
import { useTranslation } from "react-i18next";
import { LockStatus } from "@/components/viewCardModal";

export const AddComment = () => {
  const { user } = useUserStore();
  const { addComment } = useOrderStore();
  if (!user) return;

  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    resetField,
  } = useForm<FieldValues>({
    defaultValues: {
      comment: "",
      ispublic: false,
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const ispublic = watch("ispublic");

  const handleRegistration = async (data: FieldValues) => {
    setIsSubmitting(true);
    try {
      const status = await addComment(data as CreateOrUpdateComment);
      if (status) {
        resetField("comment");
        toast.success(
          t("toast.success.add", {
            record: t("order.comment"),
          }),
        );
      } else {
        toast.error(
          t("toast.error.add", {
            record: t("order.comment"),
          }),
        );
      }
    } catch (e: unknown) {
      toast.error(t(`toast.error.${simpleError(e)}`));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleError = () => {
    toast.error(t("toast.error.form"));
  };

  const toggleVisibility = () => {
    setValue("ispublic", !ispublic); // Cambiar el valor de ispublic
  };

  const submitForm = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const registerOptions = {
    comment: {
      required: t("validation.required", { field: t("field.comment") }),
    },
    ispublic: {},
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-start gap-2'>
        <Avatar
          name={user.name}
          round={true}
          size='28'
          maxInitials={2}
          src={user.imageUrl}
        />
        <form
          onSubmit={handleSubmit(handleRegistration, handleError)}
          ref={formRef}
          className='w-full'
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
      </div>
      <div className='flex items-center gap-2 ml-9'>
        <ActionButton onClick={submitForm} disabled={isSubmitting}>
          <Loading disabled={!isSubmitting} />
          {t("button.save")}
        </ActionButton>
        <LockStatus toggleVisibility={toggleVisibility} status={ispublic} />
      </div>
    </div>
  );
};
