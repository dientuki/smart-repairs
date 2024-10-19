import { ModalLayout } from "@/components/modal";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";
import { useModalWindow } from "react-modal-global";
import { Icon } from "@/components/Icon";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ActionButton } from "@/components/form";
import { ButtonType } from "@/types/enums";
import { BudgetTable } from "@/components/budget";
import { useBudgetStore } from "@/store";
import { toast } from "react-toastify";
import { t } from "i18next";
import { ApiLayerError } from "@/helper/ApiLayerError";
import { AbortControllerManager } from "@/helper/AbortControllerManager";
import { useErrorHandler } from "../hooks/useErrorHandler";

type BudgetModalProps = {
  order: string;
};

export const BudgetModal = ({ order }: BudgetModalProps) => {
  const modal = useModalWindow();
  const { initialValues, updateBudget } = useBudgetStore();
  const [isLoading, setIsLoading] = useState(true);
  const [budget, setBudget] = useState<ViewBudget>();
  const [description, setDescription] = useState<OptionType[]>([]);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {budget, description} = await initialValues(order);
        setBudget(budget); // Descomentar para usarlo
        setDescription(description); // Descomentar para usarlo
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    return () => {
      AbortControllerManager.abort();
    };
  }, []);

  const handleRegistration = async (data: FieldValues) => {
    try {
      await updateBudget(order, data);
      toast.success(t(`toast.success.form`));
      modal.close();
    } catch (error) {
      if (error instanceof ApiLayerError) {
        toast.error(t(error.i18nKey));
      }
    }
  };

  const handleErrorForm = () => {
    //console.log("error", errors);
  };

  return (
    <ModalLayout
      minHeight='460px'
      width='70vw'
      title={
        <h2 className='flex flex-row items-center gap-2 px-5 py-3 text-2xl font-bold tracking-tight sm:text-3xl border-b border-gray-200 dark:border-white/10'>
          <Icon size={7} icon={ReceiptPercentIcon} />
          <span>Presupuesto</span>
        </h2>
      }
    >
      {!isLoading && (
        <form
          onSubmit={handleSubmit(handleRegistration, handleErrorForm)}
          className='px-5 py-3 flex flex-col flex-grow justify-between'
        >
          <BudgetTable
            control={control}
            errors={errors}
            budget={budget}
            description={description}
          />
          <div className='mt-4 w-full flex justify-end'>
            <ActionButton type={ButtonType.Submit}>
              {t(`budget.button.${budget ? "edit" : "add"}`)}
            </ActionButton>
          </div>
        </form>
      )}
    </ModalLayout>
  );
};
