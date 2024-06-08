import { Autocomplete, Skeleton, TextField, createFilterOptions } from "@mui/material";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";

type Props = {
  prevStep: () => void,
  device: string | null,
  devicesRepared: DeviceRepared[] | undefined,
  nextStep: (data: { deviceUnitId: string, observations: string }) => void
}

function Step3({ prevStep, device, devicesRepared, nextStep }: Props) {
  console.log(device)
  const { handleSubmit, control, formState: { errors }, setValue } = useForm();
  const autocomplete = device ? devicesRepared?.filter((d) => d.deviceId === device) : null;
  let deviceUnitSelected: string | null = null;

  if (autocomplete) {
    autocomplete.push({
      id: 'new',
      label: 'Add new device',
    })
  }

  const handleRegistration = (data: FieldValues ) => {
    console.log(deviceUnitSelected, data);
    //update deviceUnitSelected

    nextStep({
      deviceUnitId: deviceUnitSelected,
      observations: data.observations,
    });


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
      <Field>
        <Label>Devices Repared</Label>
        {autocomplete ? (
          <Autocomplete
            selectOnFocus
            disablePortal
            handleHomeEndKeys
            id="combo-box-demo"
            onKeyDown={(e) => {e.preventDefault();}}
            onChange={(event, newValue) => {
              if (newValue != null && newValue?.id !== 'new') {
                deviceUnitSelected = newValue.id;
                setValue('serial', newValue.serial);
              } else {
                deviceUnitSelected = null;
                setValue('serial', '');
              }
            }}
            isOptionEqualToValue={() => true}
            options={autocomplete}
            renderInput={(params) => <TextField {...params} />}
            renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
          />
        ) : (
          <Skeleton variant="rectangular" width={210} height={32} />
        )}
      </Field>

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