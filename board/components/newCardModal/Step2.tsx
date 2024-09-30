import { useTranslation } from "react-i18next";
import { TabPanel } from "@headlessui/react";
import {
  ActionButton,
  HiddenInput,
  InputField,
  SimpleAutocomplete,
  ValidatedAutocomplete,
} from "@/components/form";
import { useEffect, useState } from "react";
import { FieldErrors, FieldValues, useForm } from "react-hook-form";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { Icon } from "../Icon";
import { ButtonType } from "@/types/enums";
import { capitalizeFirstLetter } from "@/helper/stringHelpers";
import { Modal, PatternLockModal } from "@/components/modal";
import useErrorHandler from "@/components/hooks/useErrorHandler";
import { useDeviceStore } from "@/store";
import { use } from "i18next";

type Step2Props = {
  nextStep: () => void;
  prevStep: () => void;
  brands: OptionType[];
  deviceTypes: OptionType[];
  devices: OptionType[];
};

enum UnlockType {
  NONE = "none",
  CODE = "code",
  PATTERN = "pattern",
}

const unlockTypeEntries = Object.entries(UnlockType);

export const Step2 = ({
  nextStep,
  prevStep,
  brands,
  deviceTypes,
  devices,
}: Step2Props) => {
  const { t } = useTranslation();
  const [localDevices, setLocalDevices] = useState<OptionType[]>(devices);
  const [localDevicesTypes, setLocalDevicesTypes] =
    useState<OptionType[]>(deviceTypes);
  const [localBrands, setLocalBrands] = useState<OptionType[]>(brands);
  const [isDisableCode, setIsDisableCode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTemporaryDeviceUnit } = useDeviceStore();
  const { handleError } = useErrorHandler();

  const {
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
  } = useForm();

  const unlockOptions: OptionType[] = unlockTypeEntries.map(([key, value]) => ({
    id: value,
    label: capitalizeFirstLetter(t(`unlock_type.${key.toLowerCase()}`)) ?? "",
  }));

  useEffect(() => {
    setValue("unlocktype", unlockOptions[0]);
  }, []);

  const setErrorFields = (message: Record<string, string[]>) => {
    const toValidate = [
      "deviceid",
      "brandid",
      "typeid",
      "url",
      "serialid",
      "versionid",
      "commercialname",
      "unlocktype",
      "unlockcode",
    ];
    for (let i = 0, c = toValidate.length; i < c; i++) {
      if (message[`input.${toValidate[i]}`]) {
        setError(toValidate[i], {
          message: message[`input.${toValidate[i]}`][0],
        });
      }
    }
  };

  const upsertOptionType = (
    original: OptionType[],
    upsertItem: OptionType,
  ): OptionType[] => {
    const index = original.findIndex((item) => item.id === upsertItem.id);

    if (index === -1) {
      // Si no existe, agregamos el nuevo elemento
      return [...original, upsertItem];
    } else {
      // Si ya existe, actualizamos el elemento
      const updatedOriginal = [...original];
      updatedOriginal[index] = upsertItem;
      return updatedOriginal;
    }
  };

  const upsertBrands = (brand: OptionType) => {
    const updatedVariable = upsertOptionType(localBrands, brand);
    if (updatedVariable !== localBrands) {
      setLocalBrands(updatedVariable);
    }
  };

  const upsertDeviceTypes = (type: OptionType) => {
    const updatedVariable = upsertOptionType(localDevicesTypes, type);
    if (updatedVariable !== localDevicesTypes) {
      setLocalDevicesTypes(updatedVariable);
    }
  };

  const upsertDevices = (device: OptionType) => {
    const updatedVariable = upsertOptionType(localDevices, device);
    if (updatedVariable !== localDevices) {
      setLocalDevices(updatedVariable);
    }
  };

  const handleRegistration = async (data: FieldValues) => {
    console.log(data);
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const upsertData = await addTemporaryDeviceUnit(data);
      upsertBrands(upsertData.brand);
      upsertDeviceTypes(upsertData.type);
      upsertDevices(upsertData.device);
    } catch (error) {
      handleError(error, setErrorFields);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleErrorForm = (errors: FieldErrors<FieldValues>) => {};

  const handleDeviceChange = async (
    newValue: OptionType | null,
    reason?: string,
  ) => {
    if (newValue && newValue.id != "new" && reason === "selectOption") {
      if (typeof newValue.info === "object" && newValue.info !== null) {
        const brand = localBrands.find((b) => b.id === newValue.info.brandid);
        const type = localDevicesTypes.find(
          (t) => t.id === newValue.info.typeid,
        );
        setValue("deviceid", newValue.id);
        setValue("type", type);
        setValue("brand", brand);
        setValue("url", newValue.info.url ?? "");
        setValue("commercialname", newValue.info.commercialname ?? "");
      }
    }

    if (reason === "clear" || newValue?.id == "new") {
      reset();
      setValue("unlocktype", unlockOptions[0]);
    }
  };

  const handleDeviceWorksVersion = () => {
    /*
    Modal.open(NewDeviceUnitModal, {
      layer: 5,
      setDeviceUnit: setDeviceUnit,
    });
    */
  };

  const setPattern = (pattern: number[]) => {
    setValue("unlockcode", pattern.length > 0 ? pattern : null);
  };

  const handleUnlock = (unlock: string) => {
    switch (unlock) {
      case UnlockType.NONE:
        setIsDisableCode(true);
        break;
      case UnlockType.CODE:
        setIsDisableCode(false);
        break;
      case UnlockType.PATTERN:
        setIsDisableCode(true);
        Modal.open(PatternLockModal, { layer: 5, setPattern: setPattern });
        break;
    }
  };

  const handleUnlockTypeChange = (newValue: OptionType | null) => {
    if (!newValue) return;

    handleUnlock(newValue.id);
  };

  const registerOptions = {
    deviceid: { required: false },
    type: {
      required: t("validation.required", { field: t("field.type") }),
    },
    brand: {
      required: t("validation.required", { field: t("field.brand") }),
    },
    commercialname: {
      required: t("validation.required", {
        field: t("field.commercial_name"),
      }),
    },
    url: {
      pattern: {
        value: /^https?:\/\//,
        message: t("validation.url", { field: t("field.url") }),
      },
    },
    unlocktype: {
      required: t("validation.required", {
        field: t("field.unlock_type"),
      }),
    },
    unlockcode: { required: false },
  };

  return (
    <TabPanel unmount={false}>
      <SimpleAutocomplete
        name='devices'
        label={t("field.device")}
        options={localDevices}
        isLoading={!localDevices}
        onChange={(_, newValue, reason) => handleDeviceChange(newValue, reason)}
      />

      <form onSubmit={handleSubmit(handleRegistration, handleErrorForm)}>
        <HiddenInput
          name='deviceid'
          control={control}
          rules={registerOptions.deviceid}
        />

        <div className='grid gap-6 grid-cols-2 mt-4'>
          <ValidatedAutocomplete
            name='type'
            label={t("field.type")}
            options={localDevicesTypes}
            isLoading={!localDevicesTypes}
            control={control}
            rules={registerOptions.type}
            errors={errors}
            disableClearable
          />
          <ValidatedAutocomplete
            name='brand'
            label={t("field.brand")}
            options={localBrands}
            isLoading={!localBrands}
            control={control}
            rules={registerOptions.brand}
            errors={errors}
            disableClearable
          />
        </div>

        <div className='grid gap-6 grid-cols-2 mt-4'>
          <InputField
            name='commercialname'
            label={t("field.commercial_name")}
            control={control}
            rules={registerOptions.commercialname}
            errors={errors}
          />

          <InputField
            name='url'
            label={t("field.url")}
            control={control}
            rules={registerOptions.url}
            errors={errors}
            icon={<Icon icon={GlobeAltIcon} size={5} />}
          />
        </div>

        <div className='grid gap-6 grid-cols-3 mt-4'>
          <div className='relative h-full'>
            <ActionButton
              onClick={handleDeviceWorksVersion}
              className='absolute bottom-0 left-0 w-full'
            >
              Enciende
            </ActionButton>
          </div>
          <ValidatedAutocomplete
            name='unlocktype'
            label={t("field.unlock_type")}
            options={unlockOptions}
            control={control}
            rules={registerOptions.unlocktype}
            errors={errors}
            disableClearable
            onChange={(newValue) => handleUnlockTypeChange(newValue)}
          />
          <InputField
            name='unlockcode'
            label={t("field.unlock_code")}
            control={control}
            rules={registerOptions.unlockcode}
            errors={errors}
            disabled={isDisableCode}
          />
        </div>

        <div className='flex justify-between mt-6'>
          <ActionButton onClick={prevStep}>{t("button.previous")}</ActionButton>
          <ActionButton type={ButtonType.Submit}>
            {t("button.next")}
          </ActionButton>
        </div>
      </form>
    </TabPanel>
  );
};
