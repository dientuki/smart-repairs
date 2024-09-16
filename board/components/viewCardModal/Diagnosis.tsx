import { useOrderStore } from "@/store/OrderStore";
import { Icon } from "@/components/Icon";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useForm, FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import { ActionButton, InputField } from "@/components/form";
import { useRef, useState } from "react";
import { capitalizeFirstLetter } from "@/helper/stringHelpers";
import { simpleError } from "@/helper/toastHelper";
import { Loading } from "@/components/Loading";

export const Diagnosis = () => {
  const { order, updateDiagnosis } = useOrderStore();
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
    if (isSubmitting || data.diagnosis === order.diagnosis) return;
    setIsSubmitting(true);
    try {
      const status = await updateDiagnosis(data.diagnosis);
      if (status) {
        toast.success(t("toast.success", { record: t("order.diagnosis") }));
        if (data.diagnosis === "") {
          setIsEditing(false);
        }
      } else {
        toast.error(
          t("toast.error.update", {
            record: t("order.diagnosis", { context: "male" }),
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
    diagnosis: {
      maxLength: {
        value: 200,
        message: t("validation.maxLength", {
          field: t("field.diagnosis"),
          length: 200,
        }),
      },
    },
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row justify-between items-center h-9'>
        <div className='flex flex-row items-center gap-2'>
          <Icon size={7} icon={DocumentTextIcon} />
          <span className='text-1xl font-bold tracking-tight sm:text-2xl first-letter:uppercase'>
            {t("order.diagnosis")}
          </span>
        </div>
        {(order.diagnosis || isEditing) && (
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
        <InputField
          name='diagnosis'
          label={t("field.diagnosis")}
          labelless
          control={control}
          rules={registerOptions.diagnosis}
          errors={errors}
          defaultValue={order.diagnosis}
          placeholder={capitalizeFirstLetter(t("placeholder.diagnosis"))}
          onClick={() => {
            setIsEditing(true);
          }}
        />
      </form>
    </div>
  );
};
