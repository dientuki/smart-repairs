import { ChevronUpIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useOrderStore, useUserStore } from "@/store";
import { InputField } from "../form";
import { InputType, Layout } from "@/types/enums";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useErrorHandler } from "../hooks/useErrorHandler";

export const Money = () => {
  const [isToggled, setIsToggled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError } = useErrorHandler();
  const { order, addPayment } = useOrderStore();
  const { user } = useUserStore();
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const toggleClasses = () => {
    setIsToggled(!isToggled);
  };

  const totalPayments = order.payments.reduce(
    (acc, payment) => acc + payment.amount,
    0,
  );
  const rest = order.total - totalPayments;

  const registerOptions = {
    payment: {
      required: true,
      min: 0,
    },
  };

  const handleRegistration = async (data: FieldValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const status = await addPayment(data.payment);
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleErrorForm = () => {
    toast.error(t("toast.error.form"));
  };

  return (
    <div className='rounded-xl shadow-sm ring-1 ring-gray-950/5 dark:ring-white/10 bg-white dark:bg-white/5'>
      <div
        className='flex flex-row justify-between gap-3 cursor-pointer p-3'
        onClick={toggleClasses}
      >
        <div className='flex items-center gap-3'>payment</div>
        <div
          className={`relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-2 h-9 w-9 text-gray-400 hover:text-gray-500 focus-visible:ring-primary-600 dark:text-gray-500 dark:hover:text-gray-400 dark:focus-visible:ring-primary-500 ${isToggled ? "rotate-180" : "rotate-0"}`}
        >
          <Icon size={5} icon={ChevronUpIcon} />
        </div>
      </div>

      <div
        className={`border-t border-gray-200 dark:border-white/10 p-3 flex flex-col gap-2 ${isToggled ? "invisible absolute h-0 overflow-hidden border-none" : ""}`}
      >
        {order.hasBudget && (
          <div className='flex justify-between w-full'>
            <p className='w-2/3 first-letter:uppercase'>total</p>
            <p className='w-1/3'>
              {user.currency} {order.total}
            </p>
          </div>
        )}

        {order.payments.length > 0 &&
          order.payments.map((item, index) => (
            <div className='flex justify-between w-full' key={index}>
              <p className='w-2/3 first-letter:uppercase'>{item.created_at}</p>
              <p className='w-1/3'>
                {user.currency} {item.amount}
              </p>
            </div>
          ))}

        {order.hasBudget && (
          <div className='flex justify-between w-full'>
            <p className='w-2/3 first-letter:uppercase'>Resta</p>
            <p className='w-1/3'>
              {user.currency} {rest}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleRegistration, handleErrorForm)}
          className='ml-9'
        >
          <InputField
            name='payment'
            label='Entrega'
            control={control}
            rules={registerOptions.payment}
            errors={errors}
            layout={Layout.Row}
            icon={user.currency}
            type={InputType.Number}
            defaultValue='0'
          />
        </form>
      </div>
    </div>
  );
};
