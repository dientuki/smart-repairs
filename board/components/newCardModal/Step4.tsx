import { useTranslation } from "react-i18next";
import { ActionButton, InputField } from "@/components/form";
import { ButtonType, InputType, Layout } from "@/types/enums";
import { useErrorHandler } from "@/components/hooks/useErrorHandler";
import { FieldValues, useForm } from "react-hook-form";
import { BudgetTable } from "@/components/budget";
import { useUserStore } from "@/store";

type Step4Props = {
  nextStep: (data: FieldValues) => void;
  prevStep: () => void;
  budgetTableData: OptionType[];
};

export const Step4 = ({ prevStep, nextStep, budgetTableData }: Step4Props) => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { handleError, handleErrorForm } = useErrorHandler();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleRegistration = async (data: FieldValues) => {
    try {
      nextStep(data);
    } catch (error) {
      handleError(error);
    }
  };

  const registerOptions = {
    money: {
      required: false,
      min: 0
    },
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
          layout={Layout.Row}
          icon={user.currency}
          type={InputType.Number}
          defaultValue="0"
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
