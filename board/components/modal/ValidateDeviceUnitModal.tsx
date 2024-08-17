import "react-modal-global/styles/modal.scss" // Imports essential styles for `ModalContainer`.
import { useModalWindow } from "react-modal-global";
import ModalLayout from "@/components/modal/ModalLayout";
import { useTranslation } from "react-i18next";
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { Field, Input, Label } from '@headlessui/react';
import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from 'react';
import { useOrderStore } from "@/store/OrderStore";
import { toast } from "react-toastify";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import { useShallow } from 'zustand/react/shallow'

const filter = createFilterOptions<Device>();
type ModalParams = {
  order: string;
};

function ValidateDeviceUnitModal() {
  const modal = useModalWindow<ModalParams>();
  const { t } = useTranslation();
  const { deviceUnitValidate, getDeviceUnitValidate} = useOrderStore();
  const { handleSubmit, control, formState: { errors }, setValue, setError, trigger } = useForm();

  /*
  const { versiones } = useOrderStore(
    useShallow((data) => ({ nuts: state.nuts, honey: state.honey })),
  )
  */

  /*
  const { handleSubmit, control, formState: { errors }, setValue} = useForm();
  const [ deviceVersionId, setDeviceVersionId ] = useState<string>('');
  */


  useEffect(() => {
    getDeviceUnitValidate(modal.params.order).catch((e: any) => {
      console.log(e.message);
      toast.error(t(`toast.error.${e.message}`));
    });
  }, [getDeviceUnitValidate]);

  const handleRegistration = (data: FieldValues ) => {
    modal.close();
  }

  const handleError = (errors: FieldErrors<FieldValues>) => {
    toast.error("Error en el formulario de error react");
  };

  const registerOptions = {
    serial: {required: false},
    deviceversion: {required: false},
  }

  const handleDeviceChange = useCallback(async(newValue: Device | null, reason: string) => {
    console.log('here')
  }, []);

  return (
    <ModalLayout width="528px" height="460px">
      {deviceUnitValidate &&
        <form onSubmit={handleSubmit(handleRegistration, handleError)}>
          <Field>
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.device')}</Label>
            {deviceUnitValidate.devices && (
              <Autocomplete
                selectOnFocus
                handleHomeEndKeys
                id="devices"
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  if (params.inputValue !== '') {
                    filtered.push({
                      id: 'new',
                      label: 'Agregar equipo nuevo',
                    });
                  }

                  return filtered;
                }}
                options={deviceUnitValidate.devices}
                isOptionEqualToValue={() => true}
                renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
                renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
              />
            )}
          </Field>

          <div className="grid gap-6 grid-cols-2 mt-4">
            <Field>
              <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.type')}</Label>
              { deviceUnitValidate.deviceTypes &&
                  <Controller
                    name="typeid"
                    control={control}
                    defaultValue=""
                    rules={registerOptions.typeid}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        selectOnFocus
                        handleHomeEndKeys
                        onChange={(event, newValue) => {
                          setValue('typeid', newValue?.label);
                          setComboBox({ ...comboBox, type: newValue?.id });
                        }}
                        options={deviceUnitValidate.deviceTypes}
                        isOptionEqualToValue={() => true}
                        renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
                      />
                    )}
                  />
              }
              {errors?.typeid && errors.typeid.message && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {typeof errors.typeid.message === 'string' ? errors.typeid.message : JSON.stringify(errors.typeid.message)}
                </p>
              )}
            </Field>

            <Field>
              <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.brand')}</Label>
              { deviceUnitValidate.brands &&
                  <Controller
                    name="brandid"
                    control={control}
                    defaultValue=""
                    rules={registerOptions.brandid}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        selectOnFocus
                        handleHomeEndKeys
                        onChange={(event, newValue) => {
                          setValue('brandid', newValue?.label);
                          setComboBox({ ...comboBox, brand: newValue?.id });
                        }}
                        options={deviceUnitValidate.brands}
                        isOptionEqualToValue={() => true}
                        renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
                      />
                    )}
                  />
              }
              {errors?.brandid && errors.brandid.message && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {typeof errors.brandid.message === 'string' ? errors.brandid.message : JSON.stringify(errors.brandid.message)}
                </p>
              )}
            </Field>
          </div>
          <Field>
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.commercial_name')}</Label>
            <Controller
              name="commercialname"
              control={control}
              defaultValue=""
              rules={registerOptions.commercialname}
              render={({ field }) => (
                <Input {...field} className={`${errors?.commercialname ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500' } text-sm rounded-lg  block w-full p-2.5 border`} />
              )}
            />
            {errors?.commercialname && errors.commercialname.message && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {typeof errors.commercialname.message === 'string' ? errors.commercialname.message : JSON.stringify(errors.commercialname.message)}
              </p>
            )}
          </Field>
          <Field>
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.url')}</Label>
            <div className="flex">
              <div className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md">
                <GlobeAltIcon className="w-4 h-4 text-gray-500 " aria-hidden="true" />
              </div>
              <Controller
                name="url"
                control={control}
                defaultValue=""
                rules={registerOptions.url}
                render={({ field }) => (
                  <Input  {...field} className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5" />
                )}
              />
            </div>
            {errors?.url && errors.url.message && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {typeof errors.url.message === 'string' ? errors.url.message : JSON.stringify(errors.url.message)}
              </p>
            )}
          </Field>

        </form>
      }
    </ModalLayout>
  )
}

export default ValidateDeviceUnitModal;