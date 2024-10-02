import { Field, TabPanel } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { ActionButton, TextareaField } from "@/components/form";
import { ButtonType } from "@/types/enums";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { FieldValues, useForm } from "react-hook-form";
import { BudgetTable } from "../budget";

type Step3Props = {
  nextStep: () => void;
  prevStep: () => void;
  tmpDeviceUnit: string;
  budgetTableData: OptionType[];
};

export const Step3 = ({ prevStep, nextStep, tmpDeviceUnit, budgetTableData  }: Step3Props) => {
  const { t } = useTranslation();
  const { handleError, handleErrorForm } = useErrorHandler();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleRegistration = async (data: FieldValues) => {

    try {
      console.log(data)
      return;
    } catch (error) {
      handleError(error);
    }

  }

  const registerOptions = {
    comment: { required: false },
    damagedescription: { required: false },
    featuredescription: { required: false },
  };

  return (
    <TabPanel unmount={false}>
      <form onSubmit={handleSubmit(handleRegistration, handleErrorForm)}>
        <TextareaField
          name='observation'
          label={t("field.observation")}
          control={control}
          rules={registerOptions.comment}
          errors={errors}
          rows={2}
        />

        <BudgetTable control={control} errors={errors} description={budgetTableData} required={false} />



        <div className='flex justify-between mt-6'>
          <ActionButton onClick={prevStep}>Anterior</ActionButton>
          <ActionButton type={ButtonType.Submit}>Finalizar</ActionButton>
        </div>
      </form>
    </TabPanel>
  );
};
