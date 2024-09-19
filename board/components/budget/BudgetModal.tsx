import { ModalLayout } from "@/components/modal";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";
import { useModalWindow } from "react-modal-global";
import { Icon } from "@/components/Icon";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ActionButton } from "@/components/form";
import { ButtonType } from "@/types/enums";
import { BudgetTable } from "@/components/budget";

export const BudgetModal = () => {
  const modal = useModalWindow();
  const [isLoading, setIsLoading] = useState(true);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  const handleRegistration = (data: FieldValues) => {
    console.log("Datos completos del formulario:", data);
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
          <BudgetTable control={control} errors={errors} />

          <ActionButton type={ButtonType.Submit}>Submit</ActionButton>
        </form>
      )}
    </ModalLayout>
  );
};
