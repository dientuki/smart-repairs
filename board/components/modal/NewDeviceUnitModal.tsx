import { useModalWindow } from "react-modal-global";
import { ModalLayout } from "@/components/modal";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { ActionButton, ValidatedAutocomplete } from "@/components/form";
import { FieldErrors, FieldValues, useForm } from "react-hook-form";
import { ButtonType } from "@/types/enums";

type ModalParams = {
  setDeviceUnit: (data: FieldValues) => void;
  versions: OptionType[];
};

function NewDeviceUnitModal() {
  const { t } = useTranslation();
  const modal = useModalWindow<ModalParams>();
  const {
    formState: { errors },
    handleSubmit,
    control,
    resetField,
  } = useForm();

  const handleRegistration = async (data: FieldValues) => {};
  const handleErrorForm = (errors: FieldErrors<FieldValues>) => {};

  const handleVersionChange = async (newValue: OptionType | null) => {
    resetField("serial");
    /*
    try {
      const response = await getDevicesUnitsByVersion(newValue.id);
      setDeviceUnitsByVersion(response.data);
    } catch (e) {

    }
    */
  };

  const registerOptions = {
    serial: { required: false },
    version: { required: false },
  };

  return (
    <ModalLayout width='328px' height='260px'>
      <form onSubmit={handleSubmit(handleRegistration, handleErrorForm)} className="p-4 flex flex-col gap-2">
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
          options={modal.params.versions}
          isLoading={!modal.params.versions}
          control={control}
          rules={registerOptions.serial}
          errors={errors}
          disableClearable
        />

        <ActionButton onClick={modal.close} type={ButtonType.Submit} className="w-full">
          Listo!
        </ActionButton>
      </form>
    </ModalLayout>
  );
}

export default NewDeviceUnitModal;
