import { useModalWindow } from "react-modal-global";
import { ModalLayout } from "@/components/modal";
import { useTranslation } from "react-i18next";
import { ActionButton, ValidatedAutocomplete } from "@/components/form";
import { FieldValues, useForm } from "react-hook-form";
import { ButtonType } from "@/types/enums";
import { useDeviceStore } from "@/store";
import { useState } from "react";
import { useErrorHandler } from "@/components/hooks/useErrorHandler";

type ModalParams = {
  setDeviceUnit: (data: FieldValues) => void;
  versions: OptionType[];
};

export const NewDeviceUnitModal = () => {
  const { t } = useTranslation();
  const { getDevicesUnitsByVersion } = useDeviceStore();
  const { handleError, handleErrorForm } = useErrorHandler();
  const modal = useModalWindow<ModalParams>();
  const {
    formState: { errors },
    handleSubmit,
    control,
    resetField,
  } = useForm();

  const handleRegistration = async (data: FieldValues) => {
    modal.params.setDeviceUnit(data);
    modal.close();
  };

  const [deviceUnitsByVersion, setDeviceUnitsByVersion] = useState<
    OptionType[]
  >([]);

  const handleVersionChange = async (newValue: OptionType | null) => {
    if (!newValue) return;
    resetField("serial");

    try {
      setDeviceUnitsByVersion([]);
      const response = await getDevicesUnitsByVersion(newValue.id);
      setDeviceUnitsByVersion(response);
    } catch (error) {
      handleError(error);
    }
  };

  const registerOptions = {
    serial: { required: false },
    version: { required: true },
  };

  return (
    <ModalLayout width='328px' height='270px'>
      <form
        onSubmit={handleSubmit(handleRegistration, handleErrorForm)}
        className='p-4 flex flex-col h-full justify-between'
      >
        <div className='flex flex-col gap-4'>
          <ValidatedAutocomplete
            name='version'
            label={t("field.device_version")}
            options={modal.params.versions}
            control={control}
            rules={registerOptions.version}
            errors={errors}
            disableClearable
            onChange={(newValue) => handleVersionChange(newValue)}
          />

          <ValidatedAutocomplete
            name='serial'
            label={t("field.serial")}
            options={deviceUnitsByVersion}
            isLoading={deviceUnitsByVersion.length === 0}
            control={control}
            rules={registerOptions.serial}
            errors={errors}
          />
        </div>
        <ActionButton type={ButtonType.Submit} className='w-full'>
          Listo!
        </ActionButton>
      </form>
    </ModalLayout>
  );
};
