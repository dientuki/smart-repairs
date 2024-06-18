import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { useState } from "react";
import { useOrderStore } from "@/store/OrderStore";
import { toast } from "react-toastify";


type Props = {
  prevStep: () => void,
  checks: any,
  nextStep: () => void
}


function Step4({ prevStep, nextStep, checks }: Props) {
  const handleSubmit = (event) => {
    event.preventDefault()

    const damages = checks.damages.map((damage, index) => ({
      value: checks.damages[index],
      checked: event.target.damages[index].checked,
    }));

    const features = checks.features.map((feature, index) => ({
      value: checks.features[index],
      checked: event.target.features[index].checked,
    }));

    console.log(damages, features)

    nextStep({
      damageDescription: event.target.damageDescription.value,
      featureDescription: event.target.featureDescription.value,
      damages,
      features
    });

    return;

  };

  return (
    <TabPanel unmount={false}>
      <form onSubmit={handleSubmit}>

      <div className="grid gap-6 grid-cols-2 mt-4">
          <Field>
            <div className="block mb-2 text-sm font-medium text-gray-900">Presenta daños</div>
            <div className="grid grid-cols-2 mt-4">
            {checks && checks.damages.map((damage, index) => (
                <label key={index} className="flex items-center mb-5 cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" name="damages" />
                  <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{damage}</span>
                </label>
            ))}
            </div>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Obervaciones adicionales</Label>
            <Input name="damageDescription" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
          </Field>

          <Field>
            <div className="block mb-2 text-sm font-medium text-gray-900">Caracteristicas</div>
            <div className="grid grid-cols-2 mt-4">
            {checks && checks.features.map((features, index) => (
                <label key={index} className="flex items-center mb-5 cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" name="features" />
                  <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{features}</span>
              </label>
            ))}
            </div>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Obervaciones adicionales</Label>
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

export default Step4;