import { useModalWindow } from "react-modal-global";
import { ModalLayout } from "@/components/modal";
import { useTranslation } from "react-i18next";
import { useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import { InputField, ValidatedAutocomplete } from "@/components/form";
import { useBoardStore, useBrandStore, useDeviceStore, useDeviceTypeStore, useOrderStore } from "@/store";

type ModalParams = {
  order: string;
  deviceUnitId: string | null;
};

type SelectionState = {
  type: OptionType | null;
  brand: OptionType | null;
  device: OptionType | null;
  version: OptionType | null;
  serial: OptionType | null;
};

function UpdateDeviceUnitModal() {
  const modal = useModalWindow<ModalParams>();
  const { t } = useTranslation();
  const { brands } = useBrandStore();
  const { deviceTypes } = useDeviceTypeStore();
  const { clear, devices, deviceVersions, deviceUnitsByVersion, deviceUnit } = useDeviceStore();
  const { getDeviceUnitUpdate, getDevicesByTypeAndBrand, getDeviceVersions, getDevicesUnitsByVersion, confirmDeviceUnit } = useDeviceStore();
  const { getOrder } = useOrderStore();
  const { getBoard } = useBoardStore();
  const { handleSubmit, control, formState: { errors }, getValues, setValue, setError, trigger } = useForm();
  const [isLoading, setIsLoading] = useState(true);

  const [selection, setSelection] = useState<SelectionState>({
    type: null,
    brand: null,
    device: null,
    version: null,
    serial: null
  });

  modal.on("close", () => {
    clear(['devices', 'deviceVersions', 'deviceUnitsByVersion', 'deviceUnit']);
  });

  useEffect(() => {
    setValue('order', modal.params.order);
    getDeviceUnitUpdate(modal.params.order, modal.params.deviceUnitId)
      .catch((e: any) => {
        toast.error(t(`toast.error.${e.message}`));
      });
  }, []);

  useEffect(() => {
    findAndSet(deviceTypes, deviceUnit.type_id, setType, 'type');
    findAndSet(brands, deviceUnit.brand_id, setBrand, 'brand');
    findAndSet(devices, deviceUnit.device_id, setDevice, 'device');
    setValue('url', deviceUnit.url || '');
    findAndSet(deviceVersions, deviceUnit.device_version_id, setVersion, 'version');
    if (deviceUnit.device_unit_id) {
      findAndSet(deviceUnitsByVersion, deviceUnit.device_unit_id, setSerial, 'serial');
    }
    setIsLoading(false);
  }, [deviceUnit]);

  useEffect(() => {
    if (deviceVersions.length == 0) return;
    findAndSet(deviceVersions, getValues('versionid'), setVersion, 'version');
  }, [deviceVersions]);

  useEffect(() => {
    if (!deviceUnit.device_unit_id && deviceUnit.serial) {
      deviceUnitsByVersion.push({ id: '', label: deviceUnit.serial });
      setSerial(deviceUnitsByVersion[0]);
      setValue('seriallabel', deviceUnitsByVersion[0].label);
    }
    findAndSet(deviceUnitsByVersion, getValues('serialid'), setSerial, 'serial');
  }, [deviceUnitsByVersion]);

  const setType = (type: OptionType | null) => {
    setSelection(prev => ({ ...prev, type }));
  };

  const setBrand = (brand: OptionType | null) => {
    setSelection(prev => ({ ...prev, brand }));
  };

  const setDevice = (device: OptionType | null) => {
    setSelection(prev => ({ ...prev, device }));
  };

  const setVersion = (version: OptionType | null) => {
    setSelection(prev => ({ ...prev, version }));
  };

  const setSerial = (serial: OptionType | null) => {
    setSelection(prev => ({ ...prev, serial }));
  };

  const findAndSet = (options: OptionType[], id: string, setOption: (option: OptionType | null) => void,  prefix: string) => {
    const option = options.find(item => item.id === id) || null;
    setOption(option);
    if (option) {
      setValue(`${prefix}id`, option.id);
      setValue(`${prefix}label`, option.label);
    }
  };

  const handleRegistration = async(data: FieldValues ) => {
    data.deviceunitid = deviceUnit.device_unit_id || null;
    await confirmDeviceUnit(data);
    await getOrder(data.order);
    getBoard();


    modal.close();
  }

  const handleError = (errors: FieldErrors<FieldValues>) => {
    console.log('error')
    toast.error("Error en el formulario de error react");
  };

  const registerOptions = {
    typeid: { required: t('validation.required', { field: t('field.type')}) },
    brandid: { required: t('validation.required', { field: t('field.brand')}) },
    versionid: { required: t('validation.required', { field: t('field.brand')}) },
    deviceid: { required: t('validation.required', { field: t('field.commercial_name')}) },
    url: {
      pattern: {
        value: /^https?:\/\//,
        message: t('validation.url', { field: t('field.url')})
      }
    },
    serialid: { required: t('validation.required', { field: t('field.serial')}) },
  };

  const handleTypesChange =  (newValue: OptionType | null) => {
    setType(newValue);
    setValue('typeid', newValue?.id);
    setValue('typelabel', newValue?.label);
    clearByTypeAndBrand();
  }

  const handleBrandsChange = (newValue: OptionType | null) => {
    setBrand(newValue);
    setValue('brandid', newValue?.id);
    setValue('brandlabel', newValue?.label);
    clearByTypeAndBrand();
  }

  const clearByTypeAndBrand = async () => {
    clear(['devices', 'deviceVersions', 'deviceUnitsByVersion']);

    setDevice(null);
    setVersion(null);
    setSerial(null);
    ['deviceid','versionid', 'serialid',
      'devicelabel', 'versionlabel', 'seriallabel',
      'url'
    ].forEach(field => setValue(field, ''));

    try {
      await getDevicesByTypeAndBrand(getValues('typeid'), getValues('brandid'));
    } catch (e) {}
  }

  const handleDeviceChange = async (newValue: OptionType | null) => {
    clear(['deviceVersions']);

    setDevice(newValue);
    setValue('deviceid', newValue?.id);
    setValue('devicelabel', newValue?.label);
    setValue('url', newValue?.info || '');

    try {
      await getDeviceVersions(getValues('deviceid'));
    } catch (e) {}
  }

  const handleVersionChange = async(newValue: OptionType | null) => {
    setVersion(newValue);
    setValue('versionid', newValue?.id);
    setValue('versionlabel', newValue?.label);

    try {
      await getDevicesUnitsByVersion(getValues('versionid'));
    } catch (e) {}
  }

  const handleSerialChange = (newValue: OptionType | null) => {
    setSerial(newValue);
    setValue('serialid', newValue?.id);
    setValue('seriallabel', newValue?.label);
  }

  return (
    <ModalLayout width="728px" minHeight="460px">
      <h2>{ deviceUnit.device_unit_id ? "Actualizar" : "Validar" } equipo</h2>
      {!isLoading &&
        <>
          <form onSubmit={handleSubmit(handleRegistration, handleError)} >
            <div className="grid gap-6 grid-cols-2 mt-4">
                <ValidatedAutocomplete
                  name="typeid"
                  label={t('field.type')}
                  options={deviceTypes}
                  isLoading={!deviceTypes}
                  control={control}
                  rules={registerOptions.typeid}
                  errors={errors}
                  value={selection.type}
                  disableClearable
                  onChange={(_, newValue) => handleTypesChange(newValue)}
                />

                <ValidatedAutocomplete
                  name="brandid"
                  label={t('field.brand')}
                  options={brands}
                  isLoading={!brands}
                  control={control}
                  rules={registerOptions.brandid}
                  errors={errors}
                  value={selection.brand}
                  disableClearable
                  onChange={(_, newValue) => handleBrandsChange(newValue)}
                />

              </div>
              <div className="grid gap-6 grid-cols-2 mt-4">

                <ValidatedAutocomplete
                  name="deviceid"
                  label={t('field.commercial_name')}
                  options={devices}
                  isLoading={!devices}
                  control={control}
                  rules={registerOptions.deviceid}
                  errors={errors}
                  value={selection.device}
                  disableClearable
                  onChange={(_, newValue) => handleDeviceChange(newValue)}
                />

                <ValidatedAutocomplete
                  name="versionid"
                  label={t('field.device_version')}
                  options={deviceVersions}
                  isLoading={!deviceVersions}
                  control={control}
                  rules={registerOptions.versionid}
                  errors={errors}
                  value={selection.version}
                  disableClearable
                  onChange={(_, newValue) => handleVersionChange(newValue)}
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
              <ValidatedAutocomplete
                name="serialid"
                label={t('field.serial')}
                options={deviceUnitsByVersion}
                isLoading={!deviceUnitsByVersion}
                control={control}
                rules={registerOptions.serialid}
                errors={errors}
                value={selection.serial}
                disableClearable
                onChange={(_, newValue) => handleSerialChange(newValue)}
              />
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 text-center w-full mt-4">
              { deviceUnit.device_unit_id ? "Actualizar" : "Validar" }
            </button>
          </form>
        </>
      }
    </ModalLayout>
  )
}

export default UpdateDeviceUnitModal;