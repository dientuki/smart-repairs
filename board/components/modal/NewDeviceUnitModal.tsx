import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { useModalWindow } from "react-modal-global";
import ModalLayout from "@/components/modal/ModalLayout";
import { useTranslation } from "react-i18next";
import { useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useState } from 'react';
import ValidatedAutocomplete from "../form/ValidatedAutocomplete";
import { useOrderStore } from "@/store/OrderStore";

type ModalParams = {
    deviceVersion: OptionType[] | [];
    setDeviceUnit: (data: FieldValues) => void
};

type SelectionState = {
  version: OptionType | null;
  serial: OptionType | null;
};

type DataState = {
  versions: OptionType[] | [];
  serials: OptionType[] | [];
}

function NewDeviceUnitModal() {
  const modal = useModalWindow<ModalParams>();
  const { t } = useTranslation();
  const { handleSubmit, control, formState: { errors }, setValue, getValues} = useForm();
  const { getDevicesUnitsByVersionId} = useOrderStore();

  const [data, setData] = useState<DataState>({
    versions: modal.params.deviceVersion,
    serials: [],
  });
  const [selection, setSelection] = useState<SelectionState>({
    version: null,
    serial: null
  });

  const setVersion = (version: OptionType | null) => {
    setSelection(prev => ({ ...prev, version }));
  };

  const setSerial = (serial: OptionType | null) => {
    setSelection(prev => ({ ...prev, serial }));
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

    setData((prevState) => ({
      ...prevState,
      serials: []
    }) as DataState);

    try {

      const serials = await getDevicesUnitsByVersionId(getValues('versionid'));

      setData((prevState) => ({
        ...prevState,
        serials: serials,
      }) as DataState);

      if (serials) {
        findAndSet(serials, getValues('serialid'), setSerial, 'serial');
      }

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
              options={data.versions}
              isLoading={!data.versions}
              control={control}
              rules={registerOptions.versionid}
              errors={errors}
              value={selection.version}
              disableClearable
              onChange={(_, newValue) => handleVersionChange(newValue)}
            />

          <ValidatedAutocomplete
              name="serialid"
              label={t('field.serial')}
              options={data.serials}
              isLoading={!data.serials}
              control={control}
              rules={registerOptions.serialid}
              errors={errors}
              value={selection.serial}
              disableClearable
              onChange={(_, newValue) => handleSerialChange(newValue)}
            />
            <button type="submit" className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Listo!</button>
        </form>
    </ModalLayout>
  )
}

export default NewDeviceUnitModal;