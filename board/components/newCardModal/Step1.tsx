import { Autocomplete, Skeleton, TextField, createFilterOptions } from "@mui/material";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useOrderStore } from "@/store/OrderStore";
import { useState } from "react";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/16/solid";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import InputField from "../form/InputField";

const filter = createFilterOptions<Customer>();
type Props = {
  nextStep: (customer: CustomerFullName) => void,
  customers: Customer[],
}

function Step1({ nextStep, customers }: Props) {
  const { addCustomer, updateCustomer } = useOrderStore();
  const { handleSubmit, control, formState: { errors }, getValues, setValue, setError, trigger } = useForm();
  const [ selectedCustomer, setSelectedCustomer ] = useState<Customer | null>(null);
  const { t } = useTranslation();

  const handleRegistration = async(data: FieldValues ) => {
    const toValidate = ['firstname', 'lastname', 'phone', 'email'];
    const customer: CustomerFullName = {};

    try {
      if (selectedCustomer === null) {
        customer.id = await addCustomer(data as Customer);
        customer.fullName = data.firstname + ' ' + data.lastname;
        toast.success("Cliente agregado");
      } else {
        customer.id = selectedCustomer.id;
        customer.fullName = selectedCustomer.firstname + ' ' + selectedCustomer.lastname;
        for (let i = 0, c = toValidate.length; i < c; i++) {
          if (data[toValidate[i]] !== selectedCustomer[toValidate[i]]) {
            if (await updateCustomer(data as Customer)) {
              toast.success("Actualizo");
            } else {
              toast.error("Error en actualizar");
            };
            break;
          }
        }
      }

      nextStep(customer);

    } catch (e: any) {
      switch (e.constructor.name) {
        case 'Object':
          for (let i = 0, c = toValidate.length; i < c; i++) {
            if (e.hasOwnProperty(`customer.${toValidate[i]}`)) {
              setError(toValidate[i], {message: e[`customer.${toValidate[i]}`][0]});
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
    }
  };

  const handleError = (errors: FieldErrors<FieldValues>) => {
    toast.error("Error en el formulario");
  };

  const validateAtLeastOneField = (value: string) => {
    return !!getValues('phone') || !!getValues('email') || value;
  }

  const registerOptions = {
    id: {required: false},
    firstname: { required: t('validation.required', { field: t('field.firstname')}) },
    lastname: { required: t('validation.required', { field: t('field.lastname')}) },
    email: {
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t('validation.regex', { field: t('field.email')})
      },
      validate: () => validateAtLeastOneField(t('validation.required_without', { field: t('field.email'), another: t('field.phone')}))
     },
    phone: {
      pattern: {
        value:/^\+?\d+(-\d+)*$/,
        message: t('validation.regex', { field: t('field.phone')})
      },
      validate: () => validateAtLeastOneField(t('validation.required_without', { field: t('field.phone'), another: t('field.email')}))
     }
  };

  return (
    <TabPanel unmount={false}>
      <Field>
        <Label className="block mb-2 text-sm font-medium text-gray-900">Cliente</Label>
        {customers ? (
          <Autocomplete
            selectOnFocus
            handleHomeEndKeys
            id="customer"
            onChange={(event, newValue) => {
              if (newValue != null && newValue?.id !== 'new') {
                setSelectedCustomer(newValue);
                setValue('id', newValue.id);
                setValue('firstname', newValue.firstname);
                setValue('lastname', newValue.lastname);
                setValue('phone', newValue.phone);
                setValue('email', newValue.email);
              } else {
                setSelectedCustomer(null);
                setValue('id', '');
                setValue('firstname', '');
                setValue('lastname', '');
                setValue('phone', '');
                setValue('email', '');
              }
              trigger('firstname');
              trigger('lastname');
              trigger('phone');
              trigger('email');
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              if (params.inputValue !== '') {
                filtered.push({
                  id: 'new',
                  label: 'Agregar nuevo cliente',
                });
              }

              return filtered;
            }}
            isOptionEqualToValue={() => true}
            options={customers}
            renderInput={(params) => <TextField {...params} size="small" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />}
            renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
          />
        ) : (
          <Skeleton variant="rectangular" width={210} height={32} />
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
          <InputField
            name="firstname"
            label={t('field.firstname')}
            control={control}
            rules={registerOptions.firstname}
            errors={errors}
          />

          <InputField
            name="lastname"
            label={t('field.lastname')}
            control={control}
            rules={registerOptions.lastname}
            errors={errors}
          />
        </div>

        <div className="grid gap-6 grid-cols-2 mt-4">
          <InputField
            name="email"
            label={t('field.email')}
            control={control}
            rules={registerOptions.email}
            errors={errors}
            icon={EnvelopeIcon}
          />

          <InputField
            name="phone"
            label={t('field.phone')}
            control={control}
            rules={registerOptions.phone}
            errors={errors}
            icon={PhoneIcon}
          />
        </div>

        <div className="flex justify-end mt-6">
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/4">Siguiente</button>
        </div>
      </form>
    </TabPanel>
  )
}

export default Step1;