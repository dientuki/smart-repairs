import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { useModalWindow } from "react-modal-global";
import ModalLayout from "@/components/modal/ModalLayout";
import { useTranslation } from "react-i18next";
import { useForm, FieldValues, FieldErrors } from "react-hook-form";
import { Autocomplete, createFilterOptions, TextField} from "@mui/material";
import { useCallback, useEffect, useState } from 'react';
import { useOrderStore } from "@/store/OrderStore";
import { toast } from "react-toastify";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import InputField from "../form/InputField";
import ValidatedAutocomplete from "../form/ValidatedAutocomplete";

const filter = createFilterOptions<Device>();
type ModalParams = {
  order: string;
};

function ValidateDeviceUnitModal() {
  const modal = useModalWindow<ModalParams>();
  const { t } = useTranslation();
  const { getDeviceUnitValidate} = useOrderStore();
  const { handleSubmit, control, formState: { errors }, getValues, setValue, setError, trigger } = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);
  const [devices, setDevices] = useState<Device[] | false>(false);
  const [values, setValues] = useState(null);

  useEffect(() => {
    setValues({
      label: 'asdf',
    });
    getDeviceUnitValidate(modal.params.order)
      .then((queryData) => {
        setData(queryData);
        setValue('typeid', queryData.temporaryDeviceUnit.deviceType);
        setValue('brandid', queryData.temporaryDeviceUnit.deviceBrand);
        setValue('commercialname', queryData.temporaryDeviceUnit.commercialName);
        setValue('url', queryData.temporaryDeviceUnit.url);
        setValue('deviceversionid', queryData.temporaryDeviceUnit.deviceVersion);
        setValue('serial', queryData.temporaryDeviceUnit.serial);
        setDevices(queryData.devices);
      })
      .catch((e: any) => {
        toast.error(t(`toast.error.${e.message}`));
      }).finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleRegistration = (data: FieldValues ) => {
    console.log('data')
    //modal.close();
  }

  const handleError = (errors: FieldErrors<FieldValues>) => {
    console.log('error')
    toast.error("Error en el formulario de error react");
  };

  const registerOptions = {
    typeid: { required: t('validation.required', { field: t('field.type')}) },
    brandid: { required: t('validation.required', { field: t('field.brand')}) },
    deviceversionid: { required: t('validation.required', { field: t('field.brand')}) },
    commercialname: { required: t('validation.required', { field: t('field.commercial_name')}) },
    url: {
      pattern: {
        value: /^https?:\/\//,
        message: t('validation.url', { field: t('field.url')})
      }
    },
    serial: { required: t('validation.required', { field: t('field.serial')}) },
  };

  const handleDeviceChange = useCallback(async(newValue: Device | null, reason: string) => {
    console.log('here')
  }, []);

  const handleDeviceTypesChange = (newValue: OptionType | null, reason: string) => {
    console.log('0', getValues('serial'), newValue, reason);
    setValue('typeid', newValue?.label);
    //setComboBox({ ...comboBox, type: newValue?.id ?? null});
  }

  const handleBrandsChange = (newValue: OptionType | null) => {
    setValue('brandid', newValue?.label);
    //setComboBox({ ...comboBox, brand: newValue?.id ?? null });
  }

  const handleCommercialNameChange = (newValue: OptionType | null) => {
    //setValue('brandid', newValue?.label);
    console.log('change url')
    //setComboBox({ ...comboBox, brand: newValue?.id ?? null });
  }



  const deviceFilterOptions = (options: any, params: any) => {
    const filtered = filter(options, params);

    if (params.inputValue !== '') {
      filtered.push({
        id: 'new',
        label: 'Agregar equipo nuevo',
      });
    }

    return filtered;
  };

  return (
    <ModalLayout width="728px" height="460px">
      <h2>Validar equipo</h2>
      {!isLoading &&
        <>
          <form onSubmit={handleSubmit(handleRegistration, handleError)}>

            <div className="grid gap-6 grid-cols-2 mt-4">
              <ValidatedAutocomplete
                name="typeid"
                label={t('field.type')}
                options={data.deviceTypes}
                isLoading={!data.deviceTypes}
                control={control}
                rules={registerOptions.typeid}
                errors={errors}
                value={values}
                disableClearable
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    setValues({
                      label: newValue,
                    });
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setValues({
                      label: newValue.inputValue,
                    });
                  } else {
                    setValues(newValue);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some((option) => inputValue === option.label);
                  if (inputValue !== '' && !isExisting) {
                    filtered.push({
                      inputValue,
                      label: `Add "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
              />

              <ValidatedAutocomplete
                name="brandid"
                label={t('field.brand')}
                options={data.brands}
                isLoading={!data.brands}
                control={control}
                rules={registerOptions.brandid}
                errors={errors}
                disableClearable
                onChange={(_, newValue) => handleBrandsChange(newValue)}
              />
            </div>

            <div className="grid gap-6 grid-cols-2 mt-4">
              <ValidatedAutocomplete
                name="commercialname"
                label={t('field.commercial_name')}
                options={devices}
                isLoading={!devices}
                control={control}
                rules={registerOptions.commercialname}
                errors={errors}
                disableClearable
                onChange={(_, newValue) => handleCommercialNameChange(newValue)}
              />

              <ValidatedAutocomplete
                name="deviceversionid"
                label={t('field.device_version')}
                options={data.deviceVersions}
                isLoading={!data.deviceVersions}
                control={control}
                disableClearable
                rules={registerOptions.deviceversionid}
                errors={errors}
              />
            </div>

            <div className="mt-4">
              <InputField
                name="url"
                label={t('field.url')}
                control={control}
                rules={registerOptions.url}
                errors={errors}
                icon={GlobeAltIcon}
              />
            </div>

            <div className="mt-4">
              <InputField
                name="serial"
                label={t('field.serial')}
                control={control}
                rules={registerOptions.serial}
                errors={errors}
              />
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/4">Siguiente</button>
          </form>
        </>
      }
    </ModalLayout>
  )
}

export default ValidateDeviceUnitModal;