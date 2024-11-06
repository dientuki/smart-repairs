import { useTranslation } from "react-i18next";
import { ModalLayout } from "@/components/modal";
import { useEffect, useState } from "react";
import { useModalWindow } from "react-modal-global";
import { FieldErrors, FieldValues, useForm } from "react-hook-form";
import { AbortControllerManager } from "@/helper/AbortControllerManager";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useBoardStore, useDeviceStore, useOrderStore } from "@/store";
import {
  ActionButton,
  HiddenInput,
  InputField,
  ValidatedAutocomplete,
} from "../form";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import { Icon } from "../Icon";
import { ButtonType } from "@/types/enums";

type ModalParams = {
  order: string;
  deviceUnitId: string | null;
};

interface ComboData {
  brands: OptionType[];
  types: OptionType[];
  devices: OptionType[];
  versions: OptionType[];
  serials: OptionType[];
}

export const UpdateDeviceUnitModal = () => {
  const modal = useModalWindow<ModalParams>();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();
  const [comboData, setComboData] = useState<ComboData>();
  const { getOrder } = useOrderStore();
  const { getBoard } = useBoardStore();
  const {
    getDeviceUnitUpdate,
    getDevicesByTypeAndBrand,
    getDeviceVersions,
    getDevicesUnitsByVersion,
    confirmDeviceUnit,
  } = useDeviceStore();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  useEffect(() => {
    setValue("order", modal.params.order);
    setValue("deviceunitid", modal.params.deviceUnitId);
    const fetchData = async () => {
      try {
        const data = await getDeviceUnitUpdate(
          modal.params.order,
          modal.params.deviceUnitId,
        );
        setComboData(data);

        const brand = data.brands.find(
          (b: any) => b.id === data.deviceUnit.brand_id,
        );
        const type = data.types.find(
          (b: any) => b.id === data.deviceUnit.type_id,
        );
        const device = data.devices.find(
          (b: any) => b.id === data.deviceUnit.device_id,
        );
        const version = data.versions.find(
          (b: any) => b.id === data.deviceUnit.device_version_id,
        );
        const serial = data.serials.find(
          (b: any) => b.label === data.deviceUnit.serial,
        );

        setValue("brand", brand);
        setValue("type", type);
        setValue("device", device);
        setValue("version", version);
        setValue("serial", serial);
        setValue("url", data.deviceUnit.url);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    return () => {
      AbortControllerManager.abort();
    };
  }, []);

  const registerOptions = {
    type: {
      required: t("validation.required", { field: t("field.type") }),
    },
    brand: {
      required: t("validation.required", { field: t("field.brand") }),
    },
    device: {
      required: t("validation.required", {
        field: t("field.commercial_name"),
      }),
    },
    version: {
      required: t("validation.required", { field: t("field.version") }),
    },
    url: {
      pattern: {
        value: /^https?:\/\//,
        message: t("validation.url", { field: t("field.url") }),
      },
    },
    serial: {
      required: t("validation.required", { field: t("field.serial") }),
    },
  };

  const clearByTypeAndBrand = async () => {
    ["device", "version", "url"].forEach((field) => setValue(field, ""));

    try {
      const devices = await getDevicesByTypeAndBrand(
        getValues("type").id,
        getValues("brand").id,
      );

      setComboData((prevComboData) => ({
        ...prevComboData,
        devices: devices,
      }));
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeviceChange = async () => {
    const selected = getValues("device");
    setValue("url", selected.info.url || "");

    try {
      const versions = await getDeviceVersions(selected.id);

      setComboData((prevComboData) => ({
        ...prevComboData,
        versions: versions,
      }));
    } catch (error) {
      handleError(error);
    }
  };

  const handleVersionChange = async () => {
    try {
      const serials = await getDevicesUnitsByVersion(getValues("version").id);
      setComboData((prevComboData) => ({
        ...prevComboData,
        serials: serials,
      }));
    } catch (error) {
      handleError(error);
    }
  };

  const handleRegistration = async (data: FieldValues) => {
    try {
      const status = await confirmDeviceUnit(data);
      if (status) {
        await getOrder(data.order);
        await getBoard();

        modal.close();
      } else {
        alert("error");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleErrorForm = (errors: FieldErrors<FieldValues>) => {
    console.log(errors);
  };

  return (
    <ModalLayout
      className='w-[728px] min-h-[460px]'
      title={
        <h2 className='flex flex-row items-center gap-2 px-5 py-3 text-2xl font-bold tracking-tight sm:text-3xl border-b border-gray-200 dark:border-white/10'>
          <span className='first-letter:uppercase'>{t("new_order.title")}</span>
        </h2>
      }
    >
      {!isLoading && (
        <form
          onSubmit={handleSubmit(handleRegistration, handleErrorForm)}
          className='px-5 py-3 text-base min-h-0'
        >
          <HiddenInput name='order' control={control} />
          <HiddenInput name='deviceunitid' control={control} />

          <div className='grid gap-6 grid-cols-2 mt-4'>
            <ValidatedAutocomplete
              name='type'
              label={t("field.type")}
              options={comboData.types}
              control={control}
              rules={registerOptions.type}
              errors={errors}
              disableClearable
              onChange={clearByTypeAndBrand}
            />
            <ValidatedAutocomplete
              name='brand'
              label={t("field.brand")}
              options={comboData.brands}
              control={control}
              rules={registerOptions.brand}
              errors={errors}
              disableClearable
              onChange={clearByTypeAndBrand}
            />
          </div>

          <div className='grid gap-6 grid-cols-2 mt-4'>
            <ValidatedAutocomplete
              name='device'
              label={t("field.commercial_name")}
              options={comboData.devices}
              control={control}
              rules={registerOptions.device}
              errors={errors}
              disableClearable
              onChange={handleDeviceChange}
            />

            <ValidatedAutocomplete
              name='version'
              label={t("field.device_version")}
              options={comboData.versions}
              control={control}
              rules={registerOptions.version}
              errors={errors}
              disableClearable
              onChange={handleVersionChange}
            />
          </div>

          <div className='mt-4'>
            <InputField
              name='url'
              label={t("field.url")}
              control={control}
              rules={registerOptions.url}
              errors={errors}
              icon={<Icon icon={GlobeAltIcon} size={5} />}
            />
          </div>
          <div className='mt-4'>
            <ValidatedAutocomplete
              name='serial'
              label={t("field.serial")}
              options={comboData.serials}
              control={control}
              rules={registerOptions.serial}
              errors={errors}
            />
          </div>
          <ActionButton type={ButtonType.Submit} className='w-full mt-4'>
            {t("action.update")}
          </ActionButton>
        </form>
      )}
    </ModalLayout>
  );
};
