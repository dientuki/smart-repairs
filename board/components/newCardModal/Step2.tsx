import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useOrderStore } from "@/store/OrderStore";
import { useState } from "react";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Modal from "@/components/modal/Modal";
import PatternLockModal from "@/components/modal/PatternLockModal";
import NewDeviceUnitModal from '@/components/modal/NewDeviceUnitModal';
import { useCallback } from 'react';
import InputField from "../form/InputField";

const filter = createFilterOptions<Device>();
type Props = {
  nextStep: (device: DeviceInfo, tempDeviceUnitId: string) => void,
  prevStep: () => void,
  devices: Device[],
  brands: Brand[],
  deviceTypes: DeviceType[]
  devicesRepared: DeviceRepared[]
}

enum UnlockTypeEnum {
  NONE = 'none',
  CODE = 'code',
  PATTERN = 'pattern',
}

type ComboBox = {
  brand: string | null;
  type: string | null;
  deviceRepared: string | null;
};

function Step2({ nextStep, prevStep, devices, brands, deviceTypes, devicesRepared }: Props) {
  const { setCustomerDeviceUnit, getDeviceVersions } = useOrderStore();
  const deviceReparedComboEmpty = [{id: 'new', label: 'Agregar nuevo equipo'}];
  const { handleSubmit, control, formState: { errors }, setValue, setError, trigger } = useForm();
  const [ comboBox, setComboBox ] = useState<ComboBox>({ brand: null, type: null, deviceRepared: null });
  const [ deviceVersions, setDeviceVersions] = useState<DeviceVersion[]>([]);
  const [ allowNewDeviceRepared, setAllowNewDeviceRepared ] = useState(false);
  const [ isDisableCode, setIsDisableCode ] = useState(true);
  const { t } = useTranslation();
  const [ unlockType, setUnlockType] = useState<UnlockTypeEnum>(UnlockTypeEnum.NONE);
  const [ deviceReparedCombo, setDeviceReparedCombo ] = useState<DeviceRepared[]>(deviceReparedComboEmpty);
  const UnlockTypeEnumLabels: Record<string, string> = {
    [UnlockTypeEnum.NONE]: t('unlock_type.none'),
    [UnlockTypeEnum.CODE]: t('unlock_type.code'),
    [UnlockTypeEnum.PATTERN]: t('unlock_type.pattern'),
  };
  const unlocktypeOptions = Object.keys(UnlockTypeEnumLabels).map((key) => ({ id: key, label: UnlockTypeEnumLabels[key] }));
  const openPatternLock = () => Modal.open(PatternLockModal, {layer: 5, setPattern: setPattern});

  const setPattern = (pattern: number[]) => {
    setValue('unlockcode', pattern.length > 0 ? pattern : null);
  }

  const handleUnlock = (unlock: UnlockTypeEnum) => {
    switch (unlock) {
      case UnlockTypeEnum.NONE:
        setIsDisableCode(true);
        break;
      case UnlockTypeEnum.CODE:
        setIsDisableCode(false);
        break;
      case UnlockTypeEnum.PATTERN:
        setIsDisableCode(true);
        openPatternLock();
        break;
    }
  }

  const handleDeviceVersion = () => {
    Modal.open(NewDeviceUnitModal, {layer: 5, deviceVersion: deviceVersions, setDeviceUnit: setDeviceUnit });
  }

  const setDeviceUnit = (deviceversionid: string, serial: string) => {
    setValue('serial', serial);
    setValue('deviceversionid', deviceversionid);
  }

  const handleDeviceChange = useCallback(async(newValue: Device | null, reason: string) => {
    if ((newValue != null && newValue?.id !== 'new') && reason !== 'clear') {
      setAllowNewDeviceRepared(false);
      const { id, type, brand, commercialname, url } = newValue;
      const brandId = brands.find(b => b?.label === brand)?.id ?? null;
      const typeId = deviceTypes.find(t => t?.label === type)?.id ?? null;

      //setSelectedDevice(newValue);
      setValue('deviceid', id);
      setValue('typeid', type);
      setValue('brandid', brand);
      setValue('commercialname', commercialname);
      setValue('url', url);
      setComboBox({ brand: brandId, type: typeId, deviceRepared: null });
      setDeviceReparedCombo(devicesRepared?.filter(d => d.deviceId === id) ?? deviceReparedComboEmpty);
      ['typeid', 'brandid', 'commercialname', 'url'].forEach(field => trigger(field));
      ['serial','deviceversionid'].forEach(field => setValue(field, ''));

      try {
        const tmp = await getDeviceVersions(id);
        setDeviceVersions(tmp);
        setAllowNewDeviceRepared(true);
      } catch (error) {}

    } else {
      //setSelectedDevice(null);
      [
        'deviceid',
        'typeid',
        'brandid',
        'commercialname',
        'url',
        'unlockcode',
        'deviceunitid',
        'serial',
        'deviceversionid'].forEach(field => setValue(field, ''));
      setComboBox({ brand: null, type: null, deviceRepared: null });
      setDeviceReparedCombo(deviceReparedComboEmpty);
      setUnlockType(UnlockTypeEnum.NONE);
      setValue('unlocktype', UnlockTypeEnumLabels[UnlockTypeEnum.NONE]);
    }
  }, [brands, deviceTypes, devicesRepared, setComboBox, setDeviceReparedCombo, setValue, setUnlockType, trigger]);



  const handleRegistration = async (data: FieldValues ) => {
    const rawData: CustomerDeviceUnit = {
      deviceid: data.deviceid,
      commercialname: data.commercialname,
      url: data.url,
      brandid: comboBox.brand || '',
      typeid: comboBox.type || '',
      deviceunitid: comboBox.deviceRepared || '',
      unlocktype: unlockType,
      unlockcode: data.unlockcode,
      deviceversionid: data.deviceversionid,
      serial: data.serial
    }
    const device: DeviceInfo = {
      id: data.deviceid,
      label: data.commercialname ,
      type: data.typeid,
      typeId: rawData.typeid
    }

    try {
      const tempDeviceUnitId = await setCustomerDeviceUnit(rawData);
      device.id = tempDeviceUnitId.deviceid;

      nextStep(device, tempDeviceUnitId.temporarydeviceunit);

    } catch (e: any) {
      const toValidate = ['typeid', 'brandid', 'commercialname', 'url'];

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
    deviceid: {required: false},
    typeid: { required: t('validation.required', { field: t('field.type')}) },
    brandid: { required: t('validation.required', { field: t('field.brand')}) },
    commercialname: { required: t('validation.required', { field: t('field.commercial_name')}) },
    url: {
      pattern: {
        value: /^https?:\/\//,
        message: t('validation.url', { field: t('field.url')})
      }
    },
    deviceunitid: {required: false},
    unlocktype: { required: t('validation.required', { field: t('field.unlock_type')}) },
    unlockcode: { required: false },
    serial:{required: false},
    deviceversionid: {required: false},
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
            onChange={(_, newValue, reason) => handleDeviceChange(newValue, reason)}
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
          name="deviceid"
          defaultValue=""
          control={control}
          rules={registerOptions.deviceid}
          render={({ field }) => (
            <Input {...field} type="hidden"/>
          )}
        />

        <div className="grid gap-6 grid-cols-2 mt-4">
          <Field>
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.type')}</Label>
            { deviceTypes &&
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
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {typeof errors.typeid.message === 'string' ? errors.typeid.message : JSON.stringify(errors.typeid.message)}
              </p>
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
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {typeof errors.brandid.message === 'string' ? errors.brandid.message : JSON.stringify(errors.brandid.message)}
              </p>
            )}
          </Field>
        </div>

        <div className="grid gap-6 grid-cols-2 mt-4">
          <InputField
            name="commercialname"
            label={t('field.commercial_name')}
            control={control}
            rules={registerOptions.commercialname}
            errors={errors}
          />

          <InputField
            name="url"
            label={t('field.url')}
            control={control}
            rules={registerOptions.url}
            errors={errors}
            icon={GlobeAltIcon}
          />

        </div>

        <div className="grid gap-6 grid-cols-4 mt-4">
          <Field className="col-span-3">
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">Devices Repared</Label>
            <Controller
              name="deviceunitid"
              control={control}
              defaultValue=""
              rules={registerOptions.deviceunitid}
              render={({ field }) => (
                <Autocomplete
                  { ...field }
                  selectOnFocus
                  handleHomeEndKeys
                  onKeyDown={(e) => {e.preventDefault();}}
                  onChange={(event, newValue) => {
                    if (newValue != null && newValue?.id !== 'new') {
                      setValue('deviceunitid', newValue.label);
                      setComboBox({ ...comboBox, deviceRepared: newValue.id });
                    } else {
                      setValue('deviceunitid', '');
                      setComboBox({ ...comboBox, deviceRepared: null });
                    }
                  }}
                  isOptionEqualToValue={() => true}
                  options={deviceReparedCombo}
                  renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
                  renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
                />
            )}/>

            {errors?.deviceunitid && errors.deviceunitid.message && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {typeof errors.deviceunitid.message === 'string' ? errors.deviceunitid.message : JSON.stringify(errors.deviceunitid.message)}
              </p>
            )}
          </Field>

          <div className="relative">
            <button type="button" className="absolute bottom-0 right-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer w-full" disabled={!allowNewDeviceRepared} onClick={handleDeviceVersion}>Nuevo</button>
          </div>

        </div>

        <div className="grid gap-6 grid-cols-2 mt-4">
          <Field>
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.unlock_type')}</Label>
            <Controller
              name="unlocktype"
              control={control}
              defaultValue={UnlockTypeEnumLabels[UnlockTypeEnum.NONE]}
              rules={registerOptions.unlocktype}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  selectOnFocus
                  handleHomeEndKeys
                  disableClearable
                  id="unlocktype"
                  onChange={(event, newValue) => {
                    setValue('unlocktype', newValue?.label);
                    setUnlockType(newValue?.id as UnlockTypeEnum);
                    handleUnlock(newValue?.id);
                  }}
                  options={unlocktypeOptions}
                  isOptionEqualToValue={() => true}
                  renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
                  renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
                />
              )}
            />
            {errors?.unlocktype && errors.unlocktype.message && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {typeof errors.unlocktype.message === 'string' ? errors.unlocktype.message : JSON.stringify(errors.unlocktype.message)}
              </p>
            )}
          </Field>

          <Field>
            <Label className="first-letter:uppercase block mb-2 text-sm font-medium text-gray-900">{t('field.unlock_code')}</Label>
            <Controller
              name="unlockcode"
              control={control}
              defaultValue=""
              rules={registerOptions.unlockcode}
              render={({ field }) => (
                <Input {...field} readOnly={isDisableCode} className={`${errors?.unlockcode ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500' } text-sm rounded-lg  block w-full p-2.5 border`} />
              )}
            />
            {errors?.unlockcode && errors.unlockcode.message && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {typeof errors.unlockcode.message === 'string' ? errors.unlockcode.message : JSON.stringify(errors.unlockcode.message)}
              </p>
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