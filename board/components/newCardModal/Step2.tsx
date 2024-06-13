import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useOrderStore } from "@/store/OrderStore";
import { useState } from "react";
import { GlobeAltIcon } from "@heroicons/react/16/solid";

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
  const { handleSubmit, control, formState: { errors }, setValue } = useForm();
  const [comboBox, setComboBox] = useState<ComboBox>({ brand: null, type: null });

  const handleRegistration = async (data: FieldValues ) => {
    const toValidate = ['type', 'brand', 'commercialName', 'techName', 'url'];
    const newDevice: NewDevice = {
      id: '',
      commercialName: data.commercialName,
      techName: data.techName,
      url: data.url,
      brand: comboBox.brand,
      type: comboBox.type
    }
    const device: DeviceInfo = {};

    if (selectedDevice === null) {
      device.id = await addDevice(newDevice);
      device.label = newDevice.brand + ' ' + newDevice.commercialName;
      device.type = newDevice.type;
    } else {
      newDevice.id = selectedDevice.id;
      device.id = selectedDevice.id;
      device.label = selectedDevice.brand + ' ' + selectedDevice.commercialName;
      device.type = selectedDevice.type;
      for (let i = 0, c = toValidate.length; i < c; i++) {
        if (data[toValidate[i]] !== selectedDevice[toValidate[i]]) {
          await updateDevice(newDevice);
          break;
        }
      }
    }
    nextStep(device);
  };

  const handleError = (errors: FieldErrors<FieldValues>) => {
    console.log(errors);
  };

  const registerOptions = {
    id: {required: false},
    type: { required: "First name is required" },
    brand: { required: "brand name is required" },
    commercialName: { required: "phone is required" },
    techName: { required: "Last Name is required" },
    url: { required: "email is required" },
  };

  return (
    <TabPanel unmount={false}>
      <Field>
        <Label className="block mb-2 text-sm font-medium text-gray-900">Equipo</Label>
        {devices && (
          <Autocomplete
            selectOnFocus
            handleHomeEndKeys
            id="devices"
            onChange={(event, newValue) => {
              if (newValue != null && newValue?.id !== 'new') {
                setSelectedDevice(newValue);
                setValue('type', newValue.type);
                setValue('brand', newValue.brand);
                setValue('commercialName', newValue.commercialName);
                setValue('techName', newValue.techName);
                setValue('url', newValue.url);
                setComboBox({
                  brand: brands.find(brand => brand?.label === newValue.brand)?.id ?? null,
                  type: deviceTypes.find(type => type?.label === newValue.type)?.id ?? null
                });
              } else {
                setSelectedDevice(null);
                setValue('type', '');
                setValue('brand', '');
                setValue('commercialName', '');
                setValue('techName', '');
                setValue('url', '');
                setComboBox({ brand: null, type: null });
              }
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
            <Label className="block mb-2 text-sm font-medium text-gray-900">Tipo de equipo</Label>
            { brands &&
                <Controller
                  name="type"
                  control={control}
                  defaultValue=""
                  rules={registerOptions.type}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      selectOnFocus
                      handleHomeEndKeys
                      id="brands"
                      onChange={(event, newValue) => {
                        setValue('type', newValue?.label);
                        setComboBox({ ...comboBox, type: newValue?.id });
                      }}
                      options={deviceTypes}
                      isOptionEqualToValue={() => true}
                      renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
                    />
                  )}
                />
            }
            {errors?.type && errors.type.message && (
              <small className="text-danger">
                <span>{typeof errors.type.message === 'string' ? errors.type.message : JSON.stringify(errors.type.message)}</span>
              </small>
            )}
          </Field>

          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Marca</Label>
            { brands &&
                <Controller
                  name="brand"
                  control={control}
                  defaultValue=""
                  rules={registerOptions.brand}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      selectOnFocus
                      handleHomeEndKeys
                      id="brands"
                      onChange={(event, newValue) => {
                        setValue('brand', newValue?.label);
                        setComboBox({ ...comboBox, brand: newValue?.id });
                      }}
                      options={brands}
                      isOptionEqualToValue={() => true}
                      renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
                    />
                  )}
                />
            }
            {errors?.brand && errors.brand.message && (
              <small className="text-danger">
                <span>{typeof errors.brand.message === 'string' ? errors.brand.message : JSON.stringify(errors.brand.message)}</span>
              </small>
            )}
          </Field>
        </div>

        <div className="grid gap-6 grid-cols-2 mt-4">
          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Nombre comercial</Label>
            <Controller
              name="commercialName"
              control={control}
              defaultValue=""
              rules={registerOptions.commercialName}
              render={({ field }) => (
                <Input  {...field} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              )}
            />
            {errors?.commercialName && errors.commercialName.message && (
              <small className="text-danger">
                <span>{typeof errors.commercialName.message === 'string' ? errors.commercialName.message : JSON.stringify(errors.commercialName.message)}</span>
              </small>
            )}
          </Field>

          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Nombre tecnico</Label>
            <Controller
              name="techName"
              control={control}
              defaultValue=""
              rules={registerOptions.techName}
              render={({ field }) => (
                <Input  {...field} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              )}
            />
            {errors?.techName && errors.techName.message && (
              <small className="text-danger">
                <span>{typeof errors.techName.message === 'string' ? errors.techName.message : JSON.stringify(errors.techName.message)}</span>
              </small>
            )}
          </Field>
        </div>

        <div className="grid gap-6 grid-cols-1 mt-4">
          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Url</Label>
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