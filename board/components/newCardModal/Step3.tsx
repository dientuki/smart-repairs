import { useOrderStore } from "@/store";
import { Field, Input, Label, TabPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, TextareaField } from "@/components/form";
import { FieldErrors, FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Step3Props = {
  nextStep: () => void;
  prevStep: () => void;
};

export const Step3 = ({ prevStep, nextStep }: Step3Props) => {
  const { t } = useTranslation();
  const { createOrderSelectedData, devicesChecks, setTmpOrder } =
    useOrderStore();
  const [checks, setChecks] = useState<DeviceCheck | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    reset,
    resetField,
  } = useForm();

  useEffect(() => {
    setChecks(
      devicesChecks[
        devicesChecks.findIndex(
          (d: DeviceCheck) =>
            d.deviceTypeId === createOrderSelectedData.deviceTypeId,
        )
      ],
    );
  }, [createOrderSelectedData.deviceTypeId]);

  const handleError = (errors: FieldErrors<FieldValues>) => {
    toast.error("Error en el formulario de error react");
  };

  const handleRegistration = async (data: FieldValues) => {
    console.log(data)
    /*
    event.preventDefault();

    const formElement = event.target as HTMLFormElement;

    const damages: damage[] = checks
      ? checks.damages.map((damage, index) => ({
          value: damage.toString(),
          checked: formElement.features[index].checked,
        }))
      : [];

    const features: feature[] = checks
      ? checks.features.map((feature, index) => ({
          value: feature.toString(),
          checked: formElement.features[index].checked,
        }))
      : [];

    setTmpOrder({
      damageDescription: formElement.damageDescription.value,
      featureDescription: formElement.featureDescription.value,
      damages: damages as [damage],
      features: features as [feature],
      observation: formElement.observation.value,
    });

    nextStep();
    */
  };

  const registerOptions = {
    comment: { required: false },
    damagedescription: { required: false },
    featuredescription: { required: false },
  }

  return (
    <TabPanel unmount={false}>
      <form onSubmit={handleSubmit(handleRegistration, handleError)}>

        <TextareaField
          name='observation'
          label={t("field.observation")}
          control={control}
          rules={registerOptions.comment}
          errors={errors}
          rows={2}
        />


        <div className='grid gap-6 grid-cols-2 mt-4'>
          <Field>
            <div className='first-letter:uppercase block mb-2 text-base font-medium text-gray-900'>
              {t("field.any_damage")}
            </div>
            <div className='grid grid-cols-2 mt-4'>
              {checks &&
                checks.damages.map((damage: damage, index) => (
                  <label
                    key={index}
                    className='flex items-center mb-5 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      value=''
                      className='sr-only peer'
                      name='damages'
                    />
                    <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className='ms-3 text-base font-medium text-gray-900 dark:text-gray-300'>
                      {damage.toString()}
                    </span>
                  </label>
                ))}
            </div>
            <TextareaField
              name='damagedescription'
              label={t("field.additional_damage")}
              control={control}
              rules={registerOptions.damagedescription}
              errors={errors}
              rows={2}
            />
          </Field>

          <Field>
            <div className='first-letter:uppercase block mb-2 text-base font-medium text-gray-900'>
              {t("field.characteristics")}
            </div>
            <div className='grid grid-cols-2 mt-4'>

            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:bg-white after:absolute after:top-[2px] after:start-[2px]  after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent outline-none transition-colors duration-200 ease-in-out fi-color-custom bg-custom-600 fi-color-primary" style={{ '--c-600': 'var(--primary-600)' }}>
                <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5 rtl:-translate-x-5"></span>
              </div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span>
            </label>

              {checks &&
                checks.features.map((feature: feature, index) => (
                  <label
                    key={index}
                    className='flex items-center mb-5 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      value=''
                      className='sr-only peer'
                      name='features'
                    />
                    <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className='ms-3 text-base font-medium text-gray-900 dark:text-gray-300'>
                      {feature.toString()}
                    </span>
                  </label>
                ))}
            </div>
            <TextareaField
              name='featuredescription'
              label={t("field.additional_characteristics")}
              control={control}
              rules={registerOptions.damagedescription}
              errors={errors}
              rows={2}
            />
          </Field>
        </div>

        <div className='flex justify-between mt-6'>
          <ActionButton onClick={prevStep}>Anterior</ActionButton>
          <ActionButton type={ButtonType.Submit}>Finalizar</ActionButton>
        </div>
      </form>
    </TabPanel>
  );
};
