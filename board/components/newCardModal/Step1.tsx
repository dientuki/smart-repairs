import { Autocomplete, Skeleton, TextField, createFilterOptions } from "@mui/material";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useOrderStore } from "@/store/OrderStore";
import { useState } from "react";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/16/solid";

const filter = createFilterOptions<Customer>();
type Props = {
  nextStep: (customer: CustomerFullName) => void,
  customers: Customer[],
}

function Step1({ nextStep, customers }: Props) {
  const { addCustomer, updateCustomer } = useOrderStore();
  const { handleSubmit, control, formState: { errors }, setValue } = useForm();
  const [ selectedCustomer, setSelectedCustomer ] = useState<Customer | null>(null);

  const handleRegistration = async (data: FieldValues ) => {
    const toValidate = ['firstName', 'lastName', 'phone', 'email'];
    const customer: CustomerFullName = {};

    if (selectedCustomer === null) {
      customer.id = await addCustomer(data as Customer);
      customer.fullName = data.firstName + ' ' + data.lastName;
    } else {
      customer.id = selectedCustomer.id;
      customer.fullName = selectedCustomer.firstName + ' ' + selectedCustomer.lastName;
      for (let i = 0, c = toValidate.length; i < c; i++) {
        if (data[toValidate[i]] !== selectedCustomer[toValidate[i]]) {
          await updateCustomer(data as Customer);
          break;
        }
      }
    }

    nextStep(customer);
  };

  const handleError = (errors: FieldErrors<FieldValues>) => {
    console.log(errors);
  };

  const registerOptions = {
    id: {required: false},
    firstName: { required: "First name is required" },
    lastName: { required: "Last Name is required" },
    phone: { required: "phone is required" },
    email: { required: "email is required" },
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
                setValue('firstName', newValue.firstName);
                setValue('lastName', newValue.lastName);
                setValue('phone', newValue.phone);
                setValue('email', newValue.email);
              } else {
                setSelectedCustomer(null);
                setValue('id', '');
                setValue('firstName', '');
                setValue('lastName', '');
                setValue('phone', '');
                setValue('email', '');
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              if (params.inputValue !== '') {
                filtered.push({
                  label: `Agregar nuevo cliente`,
                  id: 'new'
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
          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Nombre</Label>
            <Controller
              name="firstName"
              defaultValue=""
              control={control}
              rules={registerOptions.firstName}
              render={({ field }) => (
                <Input {...field} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              )}
            />
            {errors?.firstName && errors.firstName.message && (
              <small className="text-danger">
                <span>{typeof errors.firstName.message === 'string' ? errors.firstName.message : JSON.stringify(errors.firstName.message)}</span>
              </small>
            )}
          </Field>

          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Apellido</Label>
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={registerOptions.lastName}
              render={({ field }) => (
                <Input  {...field} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              )}
            />
            {errors?.lastName && errors.lastName.message && (
              <small className="text-danger">
                <span>{typeof errors.lastName.message === 'string' ? errors.lastName.message : JSON.stringify(errors.lastName.message)}</span>
              </small>
            )}
          </Field>
        </div>

        <div className="grid gap-6 grid-cols-2 mt-4">
          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Email</Label>
            <div className="flex">
              <div className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md">
                <EnvelopeIcon className="w-4 h-4 text-gray-500 " aria-hidden="true" />
              </div>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={registerOptions.email}
                render={({ field }) => (
                  <Input  {...field} className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 " />
                )}
              />

            </div>
            {errors?.email && errors.email.message && (
              <small className="text-danger">
                <span>{typeof errors.email.message === 'string' ? errors.email.message : JSON.stringify(errors.email.message)}</span>
              </small>
            )}
          </Field>

          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Telefono</Label>
            <div className="flex">
              <div className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md">
                <PhoneIcon className="w-4 h-4 text-gray-500 " aria-hidden="true" />
              </div>
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                rules={registerOptions.phone}
                render={({ field }) => (
                  <Input  {...field} className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 " />
                )}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Completar con el codigo de pais correspondiente.</p>
            {errors?.phone && errors.phone.message && (
              <small className="text-danger">
                <span>{typeof errors.phone.message === 'string' ? errors.phone.message : JSON.stringify(errors.phone.message)}</span>
              </small>
            )}
          </Field>
        </div>

        <div className="flex justify-end mt-6">
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/4">Siguiente</button>
        </div>
      </form>
    </TabPanel>
  )
}

export default Step1;