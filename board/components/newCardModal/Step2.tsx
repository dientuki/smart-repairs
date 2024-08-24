import { useTranslation } from "react-i18next";
import { Input, TabPanel } from "@headlessui/react";
import { Controller, FieldErrors, FieldValues, useForm } from "react-hook-form";
import { createFilterOptions } from "@mui/material";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import InputField from "../form/InputField";
import SimpleAutocomplete from "../form/SimpleAutocomplete";
import ValidatedAutocomplete from "../form/ValidatedAutocomplete";
import { capitalizeFirstLetter } from "@/helper/functions";
import Modal from "@/components/modal/Modal";
import PatternLockModal from "@/components/modal/PatternLockModal";
import NewDeviceUnitModal from "@/components/modal/NewDeviceUnitModal";
import { useDeviceStore, useOrderStore, useBrandStore, useDeviceTypeStore } from "@/store";
import { UnlockType } from "@/types/enums";

const filter = createFilterOptions<OptionType>();
type Step2Props = {
  nextStep: () => void,
  prevStep: () => void,
}

type SelectionState = {
  type: OptionType | null;
  brand: OptionType | null;
  unlocktype: OptionType | null;
};

const unlockTypeEntries = Object.entries(UnlockType);

function Step2({ nextStep, prevStep }: Step2Props) {
  const { devices, addTemporaryDeviceUnit, getDeviceVersions, clearDeviceVersions } = useDeviceStore();
  const { brands } = useBrandStore();
  const { deviceTypes } = useDeviceTypeStore();
  const { setCreateOrderSelectedData, clearCreateOrderSelectedData } = useOrderStore();
  const { t } = useTranslation();
  const [ isDisableCode, setIsDisableCode ] = useState(true);
  const { handleSubmit, control, formState: { errors }, getValues, setValue, reset, resetField } = useForm();
  const unlockOptions: OptionType[] = unlockTypeEntries.map(([key, value]) => ({
    id: value,
    label: capitalizeFirstLetter(t(`unlock_type.${key.toLowerCase()}`)),
  }));
  const [selection, setSelection] = useState<SelectionState>({
    type: null,
    brand: null,
    unlocktype: unlockOptions[0]
  });

  useEffect(() => {
    resetUnlock();
  }, []);

  const resetUnlock = () => {
    setValue('unlocktype', unlockOptions[0].id);
    setValue('unlockcode', undefined);
  }

  const setType = (type: OptionType | null) => {
    setSelection(prev => ({ ...prev, type }));
  };

  const setBrand = (brand: OptionType | null) => {
    setSelection(prev => ({ ...prev, brand }));
  };

  const setUnlockType = (unlocktype: OptionType | null) => {
    setSelection(prev => ({ ...prev, unlocktype }));
  };

  const findAndSet = (options: OptionType[], id: string, setOption: (option: OptionType | null) => void,  prefix: string) => {
    const option = options.find(item => item.id === id) || null;
    setOption(option);
    if (option) {
      setValue(`${prefix}id`, option.id);
      setValue(`${prefix}label`, option.label);
    }
  };

  const handleDeviceChange = async(newValue: OptionType | null, reason?: string) => {
    if (newValue && newValue.id != 'new' && reason === 'selectOption') {
      clearDeviceVersions();
      if (typeof newValue.info === 'object' && newValue.info !== null) {
        setCreateOrderSelectedData({
          deviceId: newValue.id,
          deviceLabel: newValue.label,
          deviceTypeId: newValue.info.typeid,
          deviceTypeLabel: newValue.info.type
        });

        findAndSet(brands, newValue.info.brandid ?? '', setBrand, 'brand');
        findAndSet(deviceTypes, newValue.info.typeid ?? '', setType, 'type');

        setValue('url', newValue.info.url ?? '');
        setValue('commercialname', newValue.info.commercialname ?? '');
      }

      setValue('deviceid', newValue.id);

      try {
        await getDeviceVersions(newValue.id);
      } catch (error) {}
    }

    if (reason === 'clear' || newValue?.id == 'new') {
      setSelection(prev => ({ ...prev, type: null, brand: null }));
      clearCreateOrderSelectedData('deviceId');
      clearCreateOrderSelectedData('deviceLabel');
      clearCreateOrderSelectedData('deviceTypeLabel');
      clearCreateOrderSelectedData('deviceTypeId');
      clearDeviceVersions();
      reset();
      resetUnlock();
    }
  }

  const handleDeviceWorksVersion = () => {
    Modal.open(NewDeviceUnitModal, {layer: 5, setDeviceUnit: setDeviceUnit });
  }

  const setDeviceUnit = (data: FieldValues) => {
    for (const element in data) {
      resetField(element);
      if (data[element] != undefined) {
        setValue(element, data[element]);
      };
    }
  }

  const setPattern = (pattern: number[]) => {
    setValue('unlockcode', pattern.length > 0 ? pattern : null);
  }

  const openPatternLock = () => Modal.open(PatternLockModal, {layer: 5, setPattern: setPattern});

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
        openPatternLock();
        break;
    }
  }

  const handleUnlockTypeChange = (newValue: OptionType | null) => {
    if (!newValue) return;

    setValue('unlocktype', newValue.id);
    setUnlockType(newValue);
    handleUnlock(newValue.id);
  }

  const handleRegistration = async (data: FieldValues ) => {
    try {
      const status = await addTemporaryDeviceUnit(data as TemporaryDeviceUnitInput);

      nextStep();

    } catch (error) {
      console.log('error', error);
    }
  }

  const handleTypesChange =  (newValue: OptionType | null) => {
    setCreateOrderSelectedData({
      deviceTypeId: newValue?.id,
      deviceTypeLabel: newValue?.label
    });
    setType(newValue);
    setValue('typeid', newValue?.id);
    setValue('typelabel', newValue?.label);

  }

  const handleBrandsChange = (newValue: OptionType | null) => {
    setCreateOrderSelectedData({
      deviceLabel: `${newValue?.label} ${getValues('commercialname')}`
    });
    setBrand(newValue);
    setValue('brandid', newValue?.id);
    setValue('brandlabel', newValue?.label);
  }

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
    unlocktype: { required: t('validation.required', { field: t('field.unlock_type')}) },
    unlockcode: { required: false }
  };

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
    <TabPanel unmount={false}>
      <SimpleAutocomplete
        name="devices"
        label={t('field.device')}
        options={devices}
        isLoading={!devices}
        onChange={(_, newValue, reason) => handleDeviceChange(newValue, reason)}
        filterOptions={deviceFilterOptions}
      />

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
          <ValidatedAutocomplete
            name="typeid"
            label={t('field.type')}
            options={deviceTypes}
            isLoading={!deviceTypes}
            control={control}
            rules={registerOptions.typeid}
            value={selection.type}
            errors={errors}
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

        <div className="grid gap-6 grid-cols-3 mt-4">
          <div className="relative">
            <button type="button" className="absolute bottom-0 right-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer w-full" onClick={handleDeviceWorksVersion}>Enciende</button>
          </div>
          <ValidatedAutocomplete
            name="unlocktype"
            label={t('field.unlock_type')}
            options={unlockOptions}
            control={control}
            rules={registerOptions.unlocktype}
            errors={errors}
            value={selection.unlocktype}
            disableClearable
            onChange={(_, newValue) => handleUnlockTypeChange(newValue)}
          />
          <InputField
            name="unlockcode"
            label={t('field.unlock_code')}
            control={control}
            rules={registerOptions.unlockcode}
            errors={errors}
            disabled={isDisableCode}
          />
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