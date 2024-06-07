import { Autocomplete, Skeleton, TextField, createFilterOptions } from "@mui/material";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useState } from "react";

const filter = createFilterOptions<Customer>();
type Props = {
  nextStep: (customerId: string) => void,
  prevStep: () => void,
  devices: Device[],
}

function Step2({ nextStep, prevStep, devices }: Props) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const { handleSubmit, control, formState: { errors }, setValue } = useForm();

  const handleRegistration = (data: FieldValues ) => {
    if (selectedDevice === null) return;
    console.log(selectedDevice, data);
    nextStep(selectedDevice.id);
  };

  const handleError = (errors: FieldErrors<FieldValues>) => {
    console.log(errors);
  };

  const registerOptions = {
    type: { required: "First name is required" },
    brand: { required: "First name is required" },
    commercialName: { required: "phone is required" },
    techName: { required: "Last Name is required" },
    url: { required: "email is required" },
  };

  return (
    <TabPanel unmount={false}>
      <Field>
        <Label>Devices</Label>
        {devices ? (
          <Autocomplete
            selectOnFocus
            handleHomeEndKeys
            id="combo-box-demo"
            onChange={(event, newValue) => {
              console.log(newValue);
              if (newValue != null && newValue?.id !== 'new') {
                setSelectedDevice(newValue);
                setValue('deviceType', newValue.type);
                setValue('brand', newValue.brand);
                setValue('commercialName', newValue.commercialName);
                setValue('techName', newValue.techName);
                setValue('url', newValue.url);
              } else {
                setSelectedDevice(null);
                setValue('deviceType', '');
                setValue('brand', '');
                setValue('commercialName', '');
                setValue('techName', '');
                setValue('url', '');
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              if (params.inputValue !== '') {
                filtered.push({
                  label: `Add new client`,
                  id: 'new'
                });
              }

              return filtered;
            }}
            isOptionEqualToValue={() => true}
            options={devices}
            renderInput={(params) => <TextField {...params} />}
            renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
          />
        ) : (
          <Skeleton variant="rectangular" width={210} height={32} />
        )}
      </Field>


      <form onSubmit={handleSubmit(handleRegistration, handleError)}>

        <Field className="mt-4">
          <Label>deviceType</Label>
          <Controller
            name="deviceType"
            defaultValue=""
            control={control}
            rules={registerOptions.type}
            render={({ field }) => (
              <Input {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.deviceType && errors.deviceType.message && (
            <small className="text-danger">
              <span>{typeof errors.deviceType.message === 'string' ? errors.deviceType.message : JSON.stringify(errors.deviceType.message)}</span>
            </small>
          )}
        </Field>

        <Field className="mt-4">
          <Label className="">brand</Label>
          <Controller
            name="brand"
            control={control}
            defaultValue=""
            rules={registerOptions.brand}
            render={({ field }) => (
              <Input  {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.brand && errors.brand.message && (
            <small className="text-danger">
              <span>{typeof errors.brand.message === 'string' ? errors.brand.message : JSON.stringify(errors.brand.message)}</span>
            </small>
          )}

        </Field>

        <Field className="mt-4">
          <Label className="">Nombre comercial</Label>
          <Controller
            name="commercialName"
            control={control}
            defaultValue=""
            rules={registerOptions.commercialName}
            render={({ field }) => (
              <Input  {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.commercialName && errors.commercialName.message && (
            <small className="text-danger">
              <span>{typeof errors.commercialName.message === 'string' ? errors.commercialName.message : JSON.stringify(errors.commercialName.message)}</span>
            </small>
          )}

        </Field>

        <Field className="mt-4">
          <Label className="">techName</Label>
          <Controller
            name="techName"
            control={control}
            defaultValue=""
            rules={registerOptions.techName}
            render={({ field }) => (
              <Input  {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.techName && errors.techName.message && (
            <small className="text-danger">
              <span>{typeof errors.techName.message === 'string' ? errors.techName.message : JSON.stringify(errors.techName.message)}</span>
            </small>
          )}

        </Field>


        <Field className="mt-4">
          <Label className="">Url</Label>
          <Controller
            name="url"
            control={control}
            defaultValue=""
            rules={registerOptions.url}
            render={({ field }) => (
              <Input  {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.url && errors.url.message && (
            <small className="text-danger">
              <span>{typeof errors.url.message === 'string' ? errors.url.message : JSON.stringify(errors.url.message)}</span>
            </small>
          )}

        </Field>

        <div onClick={prevStep} className="mt-6 rounded-md bg-sky-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">Anterior</div>

        <input type="submit" className="mt-6 rounded-md bg-sky-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" />

      </form>

    </TabPanel>
  )
}

export default Step2;