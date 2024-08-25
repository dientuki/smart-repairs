import { useOrderStore } from "@/store";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  nextStep: () => void,
  prevStep: () => void,
}

function Step3({ prevStep, nextStep }: Props) {
  const { t } = useTranslation();
  const { createOrderSelectedData, devicesChecks, setTmpOrder } = useOrderStore();
  const [ checks, setChecks ] = useState<DeviceCheck | null>(null);

  useEffect(() => {
    setChecks(devicesChecks[devicesChecks.findIndex((d: DeviceCheck) => d.deviceTypeId === createOrderSelectedData.deviceTypeId)]);
  }, [createOrderSelectedData.deviceTypeId]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const formElement = event.target as HTMLFormElement;

    const damages: damage[] =  checks ? checks.damages.map((damage, index) => ({
      value: damage.toString(),
      checked: formElement.features[index].checked,
    })) : [];

    const features: feature[] =  checks ? checks.features.map((feature, index) => ({
      value: feature.toString(),
      checked: formElement.features[index].checked,
    })) : [];

    setTmpOrder({
      damageDescription: formElement.damageDescription.value,
      featureDescription: formElement.featureDescription.value,
      damages: damages as [damage],
      features: features as [feature],
      observation: formElement.observation.value
    });

    nextStep();
  };

  return (
    <TabPanel unmount={false}>
      <form onSubmit={handleSubmit}>
        <Field className="mt-4">
          <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.observation')}</Label>
            <Input name="observation" className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500' } text-sm rounded-lg  block w-full p-2.5 border" />
        </Field>

        <div className="grid gap-6 grid-cols-2 mt-4">
          <Field>
            <div className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.any_damage')}</div>
            <div className="grid grid-cols-2 mt-4">
            {checks && checks.damages.map((damage: damage, index) => (
                <label key={index} className="flex items-center mb-5 cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" name="damages" />
                  <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{damage.toString()}</span>
                </label>
            ))}
            </div>
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.additional_damage')}</Label>
            <Input name="damageDescription" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
          </Field>

          <Field>
            <div className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.characteristics')}</div>
            <div className="grid grid-cols-2 mt-4">
            {checks && checks.features.map((feature: feature, index) => (
                <label key={index} className="flex items-center mb-5 cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" name="features" />
                  <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{feature.toString()}</span>
              </label>
            ))}
            </div>
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.additional_characteristics')}</Label>
            <Input name="featureDescription" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
          </Field>
        </div>


        <div className="flex justify-between mt-6">
          <div onClick={prevStep} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/4 cursor-pointer">Anterior</div>

          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/4">Finalizar</button>
        </div>

      </form>

    </TabPanel>
  )
}

export default Step3;