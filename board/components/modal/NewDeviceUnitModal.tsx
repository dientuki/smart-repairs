import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { useModalWindow } from "react-modal-global";
import ModalLayout from "@/components/modal/ModalLayout";
import { useTranslation } from "react-i18next";
import { useForm, FieldValues } from "react-hook-form";
import { useEffect, useState } from 'react';
import ValidatedAutocomplete from "../form/ValidatedAutocomplete";
import { useDeviceStore } from "@/store/DeviceStore";

type ModalParams = {
    setDeviceUnit: (data: FieldValues) => void;
};

function NewDeviceUnitModal() {
  const modal = useModalWindow<ModalParams>();
  const { t } = useTranslation();
  const { handleSubmit, control, formState: { errors }, setValue, getValues, resetField} = useForm();
  const { deviceVersions, deviceUnitsByVersion, deviceUnitSelected, setDeviceUnitSelected, getDevicesUnitsByVersion } = useDeviceStore();

  useEffect(() => {
    findAndSet(deviceUnitsByVersion, getValues('serialid'), setSerial, 'serial');
  }, [deviceUnitsByVersion]);

  const setVersion = (version: OptionType | null) => {
    setDeviceUnitSelected({version});
  };

  const setSerial = (serial: OptionType | null) => {
    setDeviceUnitSelected({serial});
  };

  const handleRegistration = (data: FieldValues ) => {
    modal.params.setDeviceUnit(data);
    modal.close();
  }

  const findAndSet = (options: OptionType[], id: string, setOption: (option: OptionType | null) => void,  prefix: string) => {
    const option = options.find(item => item.id === id) || null;
    setOption(option);
    if (option) {
      setValue(`${prefix}id`, option.id);
      setValue(`${prefix}label`, option.label);
    }
  };

  const handleVersionChange = async(newValue: OptionType | null) => {
    setVersion(newValue);
    setValue('versionid', newValue?.id);
    setValue('versionlabel', newValue?.label);
    resetField('serialid');

    try {
      await getDevicesUnitsByVersion(getValues('versionid'));
    } catch (e) {}
  }

  const handleSerialChange = (newValue: OptionType | null) => {
    setSerial(newValue);
    setValue('serialid', newValue?.id);
    setValue('seriallabel', newValue?.label);
  }

  const registerOptions = {
    serialid: {required: false},
    versionid: {required: false},
  }

  return (
    <ModalLayout width="328px" height="260px">
        <form onSubmit={handleSubmit(handleRegistration)}>
          <ValidatedAutocomplete
              name="versionid"
              label={t('field.device_version')}
              options={deviceVersions}
              isLoading={!deviceVersions}
              control={control}
              rules={registerOptions.versionid}
              errors={errors}
              value={deviceUnitSelected.version}
              disableClearable
              onChange={(_, newValue) => handleVersionChange(newValue)}
            />

          <ValidatedAutocomplete
              name="serialid"
              label={t('field.serial')}
              options={deviceUnitsByVersion}
              isLoading={!deviceUnitsByVersion}
              control={control}
              rules={registerOptions.serialid}
              errors={errors}
              value={deviceUnitSelected.serial}
              disableClearable
              onChange={(_, newValue) => handleSerialChange(newValue)}
            />
            <button type="submit" className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Listo!</button>
        </form>
    </ModalLayout>
  )
}

export default NewDeviceUnitModal;