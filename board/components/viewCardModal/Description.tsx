import { useOrderStore } from "@/store/OrderStore";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { Icon } from "@/components/Icon";
import { useTranslation } from "react-i18next";
import { FieldValues, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { ActionButton, TextareaField } from "@/components/form";
import { Loading } from "@/components/Loading";
import { toast } from "react-toastify";
import { simpleError } from "@/helper/toastHelper";
import { capitalizeFirstLetter } from "@/helper/stringHelpers";

export const Description = () => {
  const { order, updateObservation } = useOrderStore();
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleRegistration = async (data: FieldValues) => {
    if (isSubmitting || data.observation === order.observation) return;
    setIsSubmitting(true);
    try {
      const status = await updateObservation(data.observation);
      if (status) {
        toast.success(
          t("toast.success.update", { record: t("order.observation") }),
        );
        if (data.observation === "") {
          setIsEditing(false);
        }
      } else {
        toast.error(
          t("toast.error.update", {
            record: t("order.observation", { context: "female" }),
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

  const submitForm = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const registerOptions = {
    observation: {
      required: t("validation.required", { field: t("field.observation") }),
    },
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row justify-between items-center h-9'>
        <div className='flex flex-row items-center gap-2'>
          <Icon size={7} icon={Bars3BottomLeftIcon} />
          <span className='text-1xl font-bold tracking-tight sm:text-2xl first-letter:uppercase'>
            {t("order.description")}
          </span>
        </div>
        {(order.observation || isEditing) && (
          <div className='flex gap-2'>
            <ActionButton
              onClick={isEditing ? submitForm : handleEditClick}
              customClass='w-auto'
              disabled={isSubmitting}
            >
              <Loading disabled={!isSubmitting} />
              {isEditing ? t("button.send") : t("button.edit")}
            </ActionButton>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit(handleRegistration, handleError)}
        ref={formRef}
        className='ml-9'
      >
        <TextareaField
          name='observation'
          label={t("field.observation")}
          labelless
          control={control}
          rules={registerOptions.observation}
          errors={errors}
          defaultValue={order.observation}
          placeholder={capitalizeFirstLetter(t("order.no_observation"))}
          onClick={() => {
            setIsEditing(true);
          }}
        />
      </form>
    </div>
  );
};
