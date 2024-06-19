import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useOrderStore } from "@/store/OrderStore";
import { useState } from "react";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const filter = createFilterOptions<Device>();
type Props = {
  nextStep: (device: DeviceInfo) => void,
  prevStep: () => void,
  devices: Device[],
  brands: Brand[],
  deviceTypes: DeviceType[]
}

type ComboBox = {
  brand: string | null;
  type: string | null;
};

function Step2({ nextStep, prevStep, devices, brands, deviceTypes }: Props) {
  const { addDevice, updateDevice } = useOrderStore();
  const [ selectedDevice, setSelectedDevice ] = useState<Device | null>(null);
  const { handleSubmit, control, formState: { errors }, setValue, setError, trigger } = useForm();
  const [comboBox, setComboBox] = useState<ComboBox>({ brand: null, type: null });
  const { t } = useTranslation();
  const handleRegistration = async (data: FieldValues ) => {

    const toValidate = ['typeid', 'brandid', 'commercialname', 'techname', 'url'];
    const newDevice: NewDevice = {
      id: '',
      commercialname: data.commercialname,
      techname: data.techname,
      url: data.url,
      brandid: comboBox.brand || '',
      typeid: comboBox.type || '',
    }
    const device: DeviceInfo = {};

    try {
      if (selectedDevice === null) {
        device.id = await addDevice(newDevice);
        device.label = brands.find(b => b.id === newDevice.brandid)?.label + ' ' + newDevice.commercialname;
        device.type = deviceTypes.find(t => t.id === newDevice.typeid)?.label;
        device.typeId = newDevice.typeid;
        toast.success("Device agregado");
      } else {
        newDevice.id = selectedDevice.id;
        device.id = selectedDevice.id;
        device.label = brands.find(b => b.id === newDevice.brandid)?.label + ' ' + newDevice.commercialname;
        device.type = deviceTypes.find(t => t.id === newDevice.typeid)?.label;
        device.typeId = newDevice.typeid;
        selectedDevice.brandid = selectedDevice.brand;
        selectedDevice.typeid = selectedDevice.type;
        for (let i = 0, c = toValidate.length; i < c; i++) {
          if (data[toValidate[i]] !== selectedDevice[toValidate[i]]) {
            if (await updateDevice(newDevice)) {
              toast.success("Actualizo");
            } else {
              toast.error("Error en actualizar");
            };
            break;
          }
        }
      }

      nextStep(device);

    } catch (e: any) {
      switch (e.constructor.name) {
        case 'Object':
          for (let i = 0, c = toValidate.length; i < c; i++) {
            if (e.hasOwnProperty(`device.${toValidate[i]}`)) {
              console.log(e[`device.${toValidate[i]}`]);
              setError(toValidate[i], {message: e[`device.${toValidate[i]}`][0]});
            }
          }
          toast.error("Error en el formulario");
          break;
        case 'Error':
          toast.error(e.message);
          break;
        default:
          toast.error("Error!! a los botes");
          break;
      }
    };
  };

  const handleError = (errors: FieldErrors<FieldValues>) => {
    toast.error("Error en el formulario de error react");
  };

  const registerOptions = {
    id: {required: false},
    typeid: { required: t('validation.required', { field: t('field.type')}) },
    brandid: { required: t('validation.required', { field: t('field.brand')}) },
    commercialname: { required: t('validation.required', { field: t('field.commercial_name')}) },
    techname: { required: t('validation.required', { field: t('field.tech_name')}) },
    url: {
      pattern: {
        value: /^https?:\/\//,
        message: t('validation.url', { field: t('field.url')})
      }
    }
  };

  return (
    <TabPanel unmount={false}>
      <Field>
        <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.device')}</Label>
        {devices && (
          <Autocomplete
            selectOnFocus
            handleHomeEndKeys
            id="devices"
            onChange={(event, newValue) => {
              if (newValue != null && newValue?.id !== 'new') {
                console.log(newValue);
                setSelectedDevice(newValue);
                setValue('id', newValue.id);
                setValue('typeid', newValue.type);
                setValue('brandid', newValue.brand);
                setValue('commercialname', newValue.commercialname);
                setValue('techname', newValue.techname);
                setValue('url', newValue.url);
                setComboBox({
                  brand: brands.find(brand => brand?.label === newValue.brand)?.id ?? null,
                  type: deviceTypes.find(type => type?.label === newValue.type)?.id ?? null
                });
              } else {
                setSelectedDevice(null);
                setValue('id', '');
                setValue('typeid', '');
                setValue('brandid', '');
                setValue('commercialname', '');
                setValue('techname', '');
                setValue('url', '');
                setComboBox({ brand: null, type: null });
              }
              trigger('typeid');
              trigger('brandid');
              trigger('commercialname');
              trigger('techname');
              trigger('url');
            }}
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
            options={devices}
            isOptionEqualToValue={() => true}
            renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
            renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
          />
        )}
      </Field>


      <form onSubmit={handleSubmit(handleRegistration, handleError)}>
        <Controller
          name="id"
          defaultValue=""
          control={control}
          rules={registerOptions.id}
          render={({ field }) => (
            <Input {...field} type="hidden"/>
          )}
        />

        <div className="grid gap-6 grid-cols-2 mt-4">
          <Field>
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.type')}</Label>
            { brands &&
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
                      options={deviceTypes}
                      isOptionEqualToValue={() => true}
                      renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
                    />
                  )}
                />
            }
            {errors?.typeid && errors.typeid.message && (
              <small className="text-danger">
                <span>{typeof errors.typeid.message === 'string' ? errors.typeid.message : JSON.stringify(errors.typeid.message)}</span>
              </small>
            )}
          </Field>

          <Field>
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.brand')}</Label>
            { brands &&
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
                      options={brands}
                      isOptionEqualToValue={() => true}
                      renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
                    />
                  )}
                />
            }
            {errors?.brandid && errors.brandid.message && (
              <small className="text-danger">
                <span>{typeof errors.brandid.message === 'string' ? errors.brandid.message : JSON.stringify(errors.brandid.message)}</span>
              </small>
            )}
          </Field>
        </div>

        <div className="grid gap-6 grid-cols-2 mt-4">
          <Field>
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.commercial_name')}</Label>
            <Controller
              name="commercialname"
              control={control}
              defaultValue=""
              rules={registerOptions.commercialname}
              render={({ field }) => (
                <Input  {...field} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              )}
            />
            {errors?.commercialname && errors.commercialname.message && (
              <small className="text-danger">
                <span>{typeof errors.commercialname.message === 'string' ? errors.commercialname.message : JSON.stringify(errors.commercialname.message)}</span>
              </small>
            )}
          </Field>

          <Field>
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.tech_name')}</Label>
            <Controller
              name="techname"
              control={control}
              defaultValue=""
              rules={registerOptions.techname}
              render={({ field }) => (
                <Input  {...field} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              )}
            />
            {errors?.techname && errors.techname.message && (
              <small className="text-danger">
                <span>{typeof errors.techname.message === 'string' ? errors.techname.message : JSON.stringify(errors.techname.message)}</span>
              </small>
            )}
          </Field>
        </div>

        <div className="grid gap-6 grid-cols-1 mt-4">
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
              <small className="text-danger">
                <span>{typeof errors.url.message === 'string' ? errors.url.message : JSON.stringify(errors.url.message)}</span>
              </small>
            )}
          </Field>
        </div>

        <div className="flex justify-between mt-6">
          <div onClick={prevStep} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/4 cursor-pointer">Anterior</div>

          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/4">Siguiente</button>
        </div>
      </form>
    </TabPanel>
  )
}

export default Step2;