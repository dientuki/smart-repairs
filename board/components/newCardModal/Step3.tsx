import { Autocomplete, TextField } from "@mui/material";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useState } from "react";
import { useOrderStore } from "@/store/OrderStore";

type Props = {
  prevStep: () => void,
  device: DeviceInfo | null,
  devicesRepared: DeviceRepared[] | undefined,
  nextStep: (data: NewOrder) => void
}

enum UnlockTypeEnum {
  NONE = 'none',
  CODE = 'code',
  PATTERN = 'pattern',
}

const UnlockTypeEnumLabels: Record<string, string> = {
  [UnlockTypeEnum.NONE]: 'Ninguno',
  [UnlockTypeEnum.CODE]: 'Código',
  [UnlockTypeEnum.PATTERN]: 'Patrón',
};

const unlockTypeOptions = Object.keys(UnlockTypeEnumLabels).map((key) => ({ id: key, label: UnlockTypeEnumLabels[key] }));

function Step3({ prevStep, device, devicesRepared, nextStep }: Props) {
  const { handleSubmit, control, formState: { errors }, setValue } = useForm();
  const [ unlockType, setunlockType] = useState<UnlockTypeEnum>(UnlockTypeEnum.NONE);
  const [ deviceUnitSelected, setDeviceUnitSelected ] = useState<string | null>(null);
  const { addDeviceUnit, updateDeviceUnit } = useOrderStore();
  const autocomplete = device ? devicesRepared?.filter((d) => d.deviceId === device) : null;

  if (autocomplete) {
    autocomplete.push({
      id: 'new',
      label: 'Agregar nuevo equipo',
    })
  }

  const handleRegistration = async (data: FieldValues ) => {
    let id: string | null = deviceUnitSelected;
    const deviceUnit: DeviceUnit = {
      id: id,
      deviceId: device?.id ?? null,
      serial: data.serial,
      unlockType: unlockType,
      unlockCode: data.unlockCode
    };

    if (deviceUnitSelected === null) {
      id = await addDeviceUnit(deviceUnit);
    } else {
      await updateDeviceUnit(deviceUnit);
    };

    nextStep({
      deviceUnitId: id as string,
      observation: data.observation,
    });
  };

  const handleError = (errors: FieldErrors<FieldValues>) => {
    console.log(errors);
  };

  const registerOptions = {
    serial: { required: "First name is required" },
    unlockType: { required: "First name is required" },
    unlockCode: { },
    observation: {required: "First name is required" },
  };

  return (
    <TabPanel unmount={false}>
      <Field>
      <Label className="block mb-2 text-sm font-medium text-gray-900">Devices Repared</Label>
        {autocomplete && (
          <Autocomplete
            selectOnFocus
            disablePortal
            handleHomeEndKeys
            id="autocomplete"
            onKeyDown={(e) => {e.preventDefault();}}
            onChange={(event, newValue) => {
              if (newValue != null && newValue?.id !== 'new') {
                setDeviceUnitSelected(newValue.id)
                setValue('serial', newValue.serial);
              } else {
                setDeviceUnitSelected(null);
                setValue('serial', '');
              }
            }}
            isOptionEqualToValue={() => true}
            options={autocomplete}
            renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
            renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
          />
        )}
      </Field>

      <form onSubmit={handleSubmit(handleRegistration, handleError)}>
        <Field className="mt-4">
          <Label className="block mb-2 text-sm font-medium text-gray-900">Numero de Imei/Serie</Label>
          <Controller
            name="serial"
            defaultValue=""
            control={control}
            rules={registerOptions.serial}
            render={({ field }) => (
              <Input {...field} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            )}
          />
          {errors?.serial && errors.serial.message && (
            <small className="text-danger">
              <span>{typeof errors.serial.message === 'string' ? errors.serial.message : JSON.stringify(errors.serial.message)}</span>
            </small>
          )}
        </Field>

        <div className="grid gap-6 grid-cols-2 mt-4">

          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Selector de desbloque</Label>
            <Controller
              name="unlockType"
              control={control}
              defaultValue=""
              rules={registerOptions.unlockType}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  selectOnFocus
                  handleHomeEndKeys
                  id="unlockType"
                  onChange={(event, newValue) => {
                    setValue('unlockType', newValue?.label);
                    setunlockType(newValue?.id as UnlockTypeEnum);
                  }}
                  options={unlockTypeOptions}
                  isOptionEqualToValue={() => true}
                  renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
                  renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
                />
              )}
            />
            {errors?.unlockType && errors.unlockType.message && (
              <small className="text-danger">
                <span>{typeof errors.unlockType.message === 'string' ? errors.unlockType.message : JSON.stringify(errors.unlockType.message)}</span>
              </small>
            )}
          </Field>

          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Codigo de desbloqueo</Label>
            <Controller
              name="unlockCode"
              control={control}
              defaultValue=""
              rules={registerOptions.unlockCode}
              render={({ field }) => (
                <Input {...field} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              )}
            />
            {errors?.unlockCode && errors.unlockCode.message && (
              <small className="text-danger">
                <span>{typeof errors.unlockCode.message === 'string' ? errors.unlockCode.message : JSON.stringify(errors.unlockCode.message)}</span>
              </small>
            )}
          </Field>
        </div>

        <Field>
          <Label className="block mb-2 text-sm font-medium text-gray-900">Problema</Label>
          <Controller
            name="observation"
            control={control}
            defaultValue=""
            rules={registerOptions.observation}
            render={({ field }) => (
              <Input  {...field} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            )}
          />
          {errors?.observation && errors.observation.message && (
            <small className="text-danger">
              <span>{typeof errors.observation.message === 'string' ? errors.observation.message : JSON.stringify(errors.observation.message)}</span>
            </small>
          )}
        </Field>

        <div className="flex justify-between mt-6">
          <div onClick={prevStep} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/4 cursor-pointer">Anterior</div>

          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/4">Finalizar</button>
        </div>

      </form>

    </TabPanel>
  )
}

export default Step3;