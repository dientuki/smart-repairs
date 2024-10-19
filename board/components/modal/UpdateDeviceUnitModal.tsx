import { useTranslation } from "react-i18next";
import { ModalLayout } from "@/components/modal";
import { useEffect, useState } from "react";
import { useModalWindow } from "react-modal-global";
import { FieldErrors, FieldValues, useForm } from "react-hook-form";
import { AbortControllerManager } from "@/helper/AbortControllerManager";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useDeviceStore } from "@/store";
import { ActionButton, HiddenInput, InputField, ValidatedAutocomplete } from "../form";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import { Icon } from "../Icon";
import { ButtonType } from "@/types/enums";

type ModalParams = {
  order: string;
  deviceUnitId: string | null;
};

export const UpdateDeviceUnitModal = () => {
  const modal = useModalWindow<ModalParams>();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();
  const [ comboData, setComboData ] = useState();
  const {
    getDeviceUnitUpdate,
  } = useDeviceStore();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    setValue("order", modal.params.order);
    const fetchData = async () => {
      try {
        const data = await getDeviceUnitUpdate(modal.params.order, modal.params.deviceUnitId);
        setComboData(data);

        const brand = data.brands.find((b: any) => b.id === data.deviceUnit.brand_id);
        const type = data.types.find((b: any) => b.id === data.deviceUnit.type_id);
        const device = data.devices.find((b: any) => b.id === data.deviceUnit.device_id);
        const version = data.versions.find((b: any) => b.id === data.deviceUnit.device_version_id);
        //onst serial = data.serials.find((b: any) => b.id === data.deviceUnit.device_version_id);

        setValue('brand', brand);
        setValue('type', type);
        setValue('device', device);
        setValue('version', version);
        //setValue('serial', serial);
        setValue('url', data.deviceUnit.url);

        console.log(data.deviceUnit);

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
      required: t("validation.required", { field: t("field.brand") }),
    },
    url: {
      pattern: {
        value: /^https?:\/\//,
        message: t("validation.url", { field: t("field.url") }),
      },
    },
  }

  const handleRegistration = async (data: FieldValues) => {
  };

  const handleErrorForm = (errors: FieldErrors<FieldValues>) => {
  };

  return (
    <ModalLayout width='728px' minHeight='460px'
      title={
        <h2 className='flex flex-row items-center gap-2 px-5 py-3 text-2xl font-bold tracking-tight sm:text-3xl border-b border-gray-200 dark:border-white/10'>
          <span className="first-letter:uppercase">{t("new_order.title")}</span>
        </h2>
      }
    >
      {!isLoading && (
        <form onSubmit={handleSubmit(handleRegistration, handleErrorForm)} className="px-5 py-3 text-base min-h-0">
          <HiddenInput name='order' control={control} />

          <div className='grid gap-6 grid-cols-2 mt-4'>
            <ValidatedAutocomplete
              name='type'
              label={t("field.type")}
              options={comboData.types}
              control={control}
              rules={registerOptions.type}
              errors={errors}
              disableClearable
            />
            <ValidatedAutocomplete
              name='brand'
              label={t("field.brand")}
              options={comboData.brands}
              control={control}
              rules={registerOptions.brand}
              errors={errors}
              disableClearable
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
            />

            <ValidatedAutocomplete
              name='version'
              label={t("field.device_version")}
              options={comboData.versions}
              control={control}
              rules={registerOptions.version}
              errors={errors}
              disableClearable
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
          <ActionButton
            type={ButtonType.Submit}
            className='w-full mt-4'
          >
            {t("action.update")}
          </ActionButton>
        </form>
      )}
    </ModalLayout>
  )

}