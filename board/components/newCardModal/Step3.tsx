import { Autocomplete, TextField } from "@mui/material";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useState } from "react";
import { useOrderStore } from "@/store/OrderStore";
import { toast } from "react-toastify";

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

const unlocktypeOptions = Object.keys(UnlockTypeEnumLabels).map((key) => ({ id: key, label: UnlockTypeEnumLabels[key] }));

function Step3({ prevStep, device, devicesRepared, nextStep }: Props) {
  const { handleSubmit, control, formState: { errors }, setValue, setError } = useForm();
  const [ unlocktype, setunlocktype] = useState<UnlockTypeEnum>(UnlockTypeEnum.NONE);
  const [ deviceUnitSelected, setDeviceUnitSelected ] = useState<string | null>(null);
  const { addDeviceUnit, updateDeviceUnit } = useOrderStore();
  const autocomplete = device ? devicesRepared?.filter((d) => d.deviceId === device.id) : null;

  if (autocomplete) {
    autocomplete.push({
      id: 'new',
      label: 'Agregar nuevo equipo',
    })
  }

  const handleRegistration = async (data: FieldValues ) => {
    let id: string | null = deviceUnitSelected;
    const deviceUnit: NewDeviceUnit = {
      id: id,
      deviceid: device?.id ?? null,
      serial: data.serial,
      unlocktype: data.unlockcode || 'none',
      unlockcode: data.unlockcode
    };

    try {
      if (deviceUnitSelected === null) {
        id = await addDeviceUnit(deviceUnit);
        toast.success("Equipo agregado");
      } else {
        if (await updateDeviceUnit(deviceUnit)) {
          toast.success("Actualizo");
        } else {
          toast.error("Error en actualizar");
        };
      };
    } catch (e: any) {
      switch (e.constructor.name) {
        case 'Object':
          const toValidate = ['serial', 'unlockcode', 'unlocktype'];
          for (let i = 0, c = toValidate.length; i < c; i++) {
            if (e.hasOwnProperty(`deviceunit.${toValidate[i]}`)) {
              setError(toValidate[i], {message: e[`deviceunit.${toValidate[i]}`][0]});
            }
          }
          break;
        case 'Error':
          toast.error(e.message);
          break;
        default:
          toast.error("Error!! a los botes");
          break;
      }
    }

    nextStep({
      deviceUnitId: id as string,
      observation: data.observation,
    });
  };

  const handleError = (errors: FieldErrors<FieldValues>) => {
    console.log(errors);
    toast.error("Error en el formulario");
  };

  const registerOptions = {
    deviceid: { required: false },
    serial: { required: false },
    unlocktype: { required: false },
    unlockcode: { required: false },
    observation: { required: false },
  };

  return (
    <TabPanel unmount={false}>
      <form onSubmit={handleSubmit(handleRegistration, handleError)}>
        <Field>
        <Label className="block mb-2 text-sm font-medium text-gray-900">Devices Repared</Label>
          {autocomplete && (
            <Autocomplete
              selectOnFocus
              disablePortal
              handleHomeEndKeys
              id="deviceid"
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
          {errors?.deviceid && errors.deviceid.message && (
            <small className="text-danger">
              <span>{typeof errors.deviceid.message === 'string' ? errors.deviceid.message : JSON.stringify(errors.deviceid.message)}</span>
            </small>
          )}
        </Field>

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
              name="unlocktype"
              control={control}
              defaultValue=""
              rules={registerOptions.unlocktype}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  selectOnFocus
                  handleHomeEndKeys
                  id="unlocktype"
                  onChange={(event, newValue) => {
                    setValue('unlocktype', newValue?.label);
                    setunlocktype(newValue?.id as UnlockTypeEnum);
                  }}
                  options={unlocktypeOptions}
                  isOptionEqualToValue={() => true}
                  renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
                  renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
                />
              )}
            />
            {errors?.unlocktype && errors.unlocktype.message && (
              <small className="text-danger">
                <span>{typeof errors.unlocktype.message === 'string' ? errors.unlocktype.message : JSON.stringify(errors.unlocktype.message)}</span>
              </small>
            )}
          </Field>

          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Codigo de desbloqueo</Label>
            <Controller
              name="unlockcode"
              control={control}
              defaultValue=""
              rules={registerOptions.unlockcode}
              render={({ field }) => (
                <Input {...field} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              )}
            />
            {errors?.unlockcode && errors.unlockcode.message && (
              <small className="text-danger">
                <span>{typeof errors.unlockcode.message === 'string' ? errors.unlockcode.message : JSON.stringify(errors.unlockcode.message)}</span>
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