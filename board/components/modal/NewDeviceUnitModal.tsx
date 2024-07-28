import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { useModalWindow } from "react-modal-global";
import ModalLayout from "@/components/modal/ModalLayout";
import { useTranslation } from "react-i18next";
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { Field, Input, Label } from '@headlessui/react';
import { Autocomplete, TextField } from "@mui/material";
import { useState } from 'react';

type ModalParams = {
    deviceVersion: DeviceVersion[];
    setDeviceUnit: (deviceversionid: string, serial: string) => void
};

function NewDeviceUnitModal() {
  const modal = useModalWindow<ModalParams>();
  const { t } = useTranslation();
  const { handleSubmit, control, formState: { errors }, setValue} = useForm();
  const [ deviceVersionId, setDeviceVersionId ] = useState<string>('');

  const handleRegistration = (data: FieldValues ) => {
    modal.params.setDeviceUnit(deviceVersionId, data.serial);
    modal.close();
  }

  const registerOptions = {
    serial: {required: false},
    deviceversion: {required: false},
  }

  return (
    <ModalLayout width="328px" height="260px">
        <form onSubmit={handleSubmit(handleRegistration)}>
            <Field>
                <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.device_version')}</Label>
                <Controller
                name="deviceversion"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <Autocomplete
                        {...field}
                        selectOnFocus
                        handleHomeEndKeys
                        disableClearable
                        id="deviceversion"
                        onChange={(_, newValue) => {
                            setValue('deviceversion', newValue.label);
                            setDeviceVersionId(newValue.id);
                        }}
                        options={modal.params.deviceVersion}
                        isOptionEqualToValue={() => true}
                        renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
                        renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
                    />
                )}
                />
            </Field>

            <Field className="mt-4">
                <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.serial')}</Label>
                <Controller
                name="serial"
                control={control}
                defaultValue=""
                rules={registerOptions.serial}
                render={({ field }) => (
                    <Input {...field} className={`${errors?.serial ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500' } text-sm rounded-lg  block w-full p-2.5 border`} />
                )}
                />
          </Field>
          <button type="submit" className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Listo!</button>
        </form>
    </ModalLayout>
  )
}

export default NewDeviceUnitModal;