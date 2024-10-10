import { Field } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { ActionButton, SimpleToggle, TextareaField } from "@/components/form";
import { ButtonType } from "@/types/enums";
import { useErrorHandler } from "@/components/hooks/useErrorHandler";
import { FieldValues, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

type Step3Props = {
  nextStep: () => void;
  prevStep: () => void;
  deviceType: string | undefined;
  checks: DeviceCheck[];
  onNext: (observation: string, orderChecks: OrderChecksTable) => void;
};

export const Step3 = ({
  prevStep,
  nextStep,
  deviceType,
  checks,
  onNext,
}: Step3Props) => {
  const { t } = useTranslation();
  const [check, setCheck] = useState<DeviceCheck | undefined>(undefined);
  const { handleErrorForm } = useErrorHandler();
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const foundCheck = checks.find(
      (check) => check.deviceTypeId === deviceType,
    );
    setCheck(foundCheck || undefined);
  }, [deviceType]);

  const handleRegistration = async (data: FieldValues) => {
    const damages: damage[] = check?.damages.map((value) => ({
      value: value,
      checked: data.damages.includes(value.toString()),
    }));

    const features: feature[] = check?.features.map((value) => ({
      value: value,
      checked: data.features.includes(value.toString()),
    }));

    const table: OrderChecksTable = {
      damages: damages,
      features: features,
      damagesDescription: data.damagedescription,
      featuresDescription: data.featuredescription,
    };

    onNext(data.observation, table);
    nextStep();
  };

  const registerOptions = {
    observation: { required: true },
    damagedescription: { required: false },
    featuredescription: { required: false },
  };

  return (
    <form onSubmit={handleSubmit(handleRegistration, handleErrorForm)}>
      <TextareaField
        name='observation'
        label={t("field.observation")}
        control={control}
        rules={registerOptions.observation}
        errors={errors}
        rows={2}
      />

      <div className='grid gap-6 grid-cols-2 my-4'>
        <Field>
          <div className='first-letter:uppercase block mb-2 text-base font-medium text-gray-900'>
            {t("field.any_damage")}
          </div>
          <div className='grid grid-cols-2 mt-4'>
            {check &&
              check.damages.map((damage: damage, index) => (
                <SimpleToggle
                  key={index}
                  name='damages'
                  value={damage.toString()}
                  text={damage.toString()}
                  register={register}
                />
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
            {check &&
              check.features.map((feature: feature, index) => (
                <SimpleToggle
                  key={index}
                  name='features'
                  value={feature.toString()}
                  text={feature.toString()}
                  register={register}
                />
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
        <ActionButton onClick={prevStep}>{t("button.previous")}</ActionButton>
        <ActionButton type={ButtonType.Submit}>{t("button.next")}</ActionButton>
      </div>
    </form>
  );
};
