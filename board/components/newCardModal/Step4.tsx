import { useTranslation } from "react-i18next";
import { ActionButton, InputField } from "@/components/form";
import { ButtonType } from "@/types/enums";
import { useErrorHandler } from "@/components/hooks/useErrorHandler";
import { FieldValues, useForm } from "react-hook-form";
import { BudgetTable } from "@/components/budget";

type Step3Props = {
  nextStep: () => void;
  prevStep: () => void;
  budgetTableData: OptionType[];
};

export const Step4 = ({ prevStep, nextStep, budgetTableData }: Step3Props) => {
  const { t } = useTranslation();
  const { handleError, handleErrorForm } = useErrorHandler();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleRegistration = async (data: FieldValues) => {
    try {
      console.log(data);
    } catch (error) {
      handleError(error);
    }
  };

  const registerOptions = {
    money: { required: false },
  };

  return (
    <form onSubmit={handleSubmit(handleRegistration, handleErrorForm)}>
      <BudgetTable
        control={control}
        errors={errors}
        description={budgetTableData}
        required={false}
        isSimple={true}
      />

      <div className='mt-4'>
        <InputField
          name='money'
          label='Entrega'
          control={control}
          rules={registerOptions.money}
          errors={errors}
        />
      </div>
      <div className='flex justify-between mt-6'>
        <ActionButton onClick={prevStep}>{t("button.previous")}</ActionButton>
        <ActionButton type={ButtonType.Submit}>
          {t("button.finish")}
        </ActionButton>
      </div>
    </form>
  );
};
