import { Autocomplete, Skeleton, TextField, createFilterOptions } from "@mui/material";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useState } from "react";

const filter = createFilterOptions<Customer>();
type Props = {
  prevStep: () => void,
  customer: string | null,
  device: string | null
}

function Step3({ customer, prevStep, device }: Props) {
  const { handleSubmit, control, formState: { errors }, setValue } = useForm();

  console.log(customer, device);

  const handleRegistration = (data: FieldValues ) => {
    /*
    if (selectedDevice === null) return;
    console.log(selectedDevice, data);
    nextStep(selectedDevice.id);
    */
   data.customer = customer;
   data.device = device;
   console.log(data);
   return;
  };

  const handleError = (errors: FieldErrors<FieldValues>) => {
    console.log(errors);
  };

  const registerOptions = {
    serial: { required: "First name is required" },
    unlockType: { required: "First name is required" },
    unlockCode: { },
    observations: {required: "First name is required" },
  };

  return (
    <TabPanel unmount={false}>
      <form onSubmit={handleSubmit(handleRegistration, handleError)}>

        <Field className="mt-4">
          <Label>Imei/Serie</Label>
          <Controller
            name="serial"
            defaultValue=""
            control={control}
            rules={registerOptions.serial}
            render={({ field }) => (
              <Input {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.serial && errors.serial.message && (
            <small className="text-danger">
              <span>{typeof errors.serial.message === 'string' ? errors.serial.message : JSON.stringify(errors.serial.message)}</span>
            </small>
          )}
        </Field>

        <Field className="mt-4">
          <Label className="">Selector de desbloque</Label>
          <Controller
            name="unlockType"
            control={control}
            defaultValue=""
            rules={registerOptions.unlockType}
            render={({ field }) => (
              <Input  {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.unlockType && errors.unlockType.message && (
            <small className="text-danger">
              <span>{typeof errors.unlockType.message === 'string' ? errors.unlockType.message : JSON.stringify(errors.unlockType.message)}</span>
            </small>
          )}

        </Field>

        <Field className="mt-4">
          <Label className="">Codigo de desbloqueo</Label>
          <Controller
            name="unlockCode"
            control={control}
            defaultValue=""
            rules={registerOptions.unlockCode}
            render={({ field }) => (
              <Input  {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.unlockCode && errors.unlockCode.message && (
            <small className="text-danger">
              <span>{typeof errors.unlockCode.message === 'string' ? errors.unlockCode.message : JSON.stringify(errors.unlockCode.message)}</span>
            </small>
          )}

        </Field>

        <Field className="mt-4">
          <Label className="">Problema</Label>
          <Controller
            name="observations"
            control={control}
            defaultValue=""
            rules={registerOptions.observations}
            render={({ field }) => (
              <Input  {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.observations && errors.observations.message && (
            <small className="text-danger">
              <span>{typeof errors.observations.message === 'string' ? errors.observations.message : JSON.stringify(errors.observations.message)}</span>
            </small>
          )}

        </Field>

        <div onClick={prevStep} className="mt-6 rounded-md bg-sky-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">Anterior</div>

        <input type="submit" className="mt-6 rounded-md bg-sky-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" />

      </form>

    </TabPanel>
  )
}

export default Step3;