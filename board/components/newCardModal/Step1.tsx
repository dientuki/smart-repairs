import { Autocomplete, Skeleton, TextField, createFilterOptions } from "@mui/material";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useOrderStore } from "@/store/OrderStore";
import { useState } from "react";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/16/solid";
import { toast } from "react-toastify";

const filter = createFilterOptions<Customer>();
type Props = {
  nextStep: (customer: CustomerFullName) => void,
  customers: Customer[],
}

function Step1({ nextStep, customers }: Props) {
  const { addCustomer, updateCustomer } = useOrderStore();
  const { handleSubmit, control, formState: { errors }, setValue, setError, trigger } = useForm();
  const [ selectedCustomer, setSelectedCustomer ] = useState<Customer | null>(null);

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
      console.log(e);
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

  const registerOptions = {
    id: {required: false},
    firstname: { required: false },
    lastname: { required: false },
    phone: { required: false },
    email: { required: false },
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
          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Nombre</Label>
            <Controller
              name="firstname"
              defaultValue=""
              control={control}
              rules={registerOptions.firstname}
              render={({ field }) => (
                <Input {...field} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              )}
            />
            {errors?.firstname && errors.firstname.message && (
              <small className="text-danger">
                <span>{typeof errors.firstname.message === 'string' ? errors.firstname.message : JSON.stringify(errors.firstname.message)}</span>
              </small>
            )}
          </Field>

          <Field>
            <Label className="block mb-2 text-sm font-medium text-gray-900">Apellido</Label>
            <Controller
              name="lastname"
              control={control}
              defaultValue=""
              rules={registerOptions.lastname}
              render={({ field }) => (
                <Input  {...field} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              )}
            />
            {errors.lastname && (
              <small className="text-danger">
                <span>{typeof errors.lastname.message === 'string' ? errors.lastname.message : JSON.stringify(errors.lastname.message)}</span>
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