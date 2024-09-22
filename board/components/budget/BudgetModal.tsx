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

type BudgetModalProps = {
  order: string;
};

export const BudgetModal = ({ order }: BudgetModalProps) => {
  const modal = useModalWindow();
  const { initialValues } = useBudgetStore();
  const [isLoading, setIsLoading] = useState(true);
  const [budget, setBudget] = useState();
  const [description, setDescription] = useState();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [budgetResume, setBudgetResume] = useState(null);
  const [budgetItems, setBudgetItems] = useState(null);

  const handleBudgetChange = (newBudgetItems, newBudgetResume) => {
    console.log("handleBudgetChange", newBudgetItems, newBudgetResume);
    setBudgetResume(newBudgetResume); // Actualiza el estado en el padre
    setBudgetItems(newBudgetItems);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInitialValues = async () => {
      try {
        const result = await initialValues(order);
        if (isMounted) {
          setBudget(result.budget);
          setDescription(result.description);
        }
      } catch (e) {
        if (isMounted) {
          toast.error(t(`toast.error.${e.message}`));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false); // Indicar que terminó la carga
        }
      }
    };

    fetchInitialValues();

    return () => {
      isMounted = false; // Limpieza del efecto
    };
  }, []);

  const handleRegistration = (data: FieldValues) => {
    console.log("Datos completos del formulario:",  budgetResume, budgetItems);
  };

  const handleError = () => {
    //console.log(errors)
    console.log("error", errors);
  };

  modal.on("close", () => {});

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
          onSubmit={handleSubmit(handleRegistration, handleError)}
          className='px-5 py-3 flex flex-col flex-grow justify-between'
        >
          <BudgetTable
            control={control}
            errors={errors}
            budget={budget}
            description={description}
            onBudgetChange={handleBudgetChange}
          />

          <ActionButton type={ButtonType.Submit}>Submit</ActionButton>
        </form>
      )}
    </ModalLayout>
  );
};
