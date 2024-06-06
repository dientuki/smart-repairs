import { Autocomplete, Skeleton, TextField, createFilterOptions } from "@mui/material";
import { Field, Input, Label, TabPanel } from '@headlessui/react';
import { Controller, useForm, FieldValues, FieldErrors } from "react-hook-form";
import { useState } from "react";

const filter = createFilterOptions<Customer>();
type Props = {
  nextStep: (customerId: string) => void,
  customers: Customer[],
}

function Step1({ nextStep, customers }: Props) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { handleSubmit, control, formState: { errors }, setValue } = useForm();

  const handleRegistration = (data: FieldValues ) => {
    if (selectedCustomer === null) return;
    console.log(selectedCustomer, data);
    nextStep(selectedCustomer.id);
  };

  const handleError = (errors: FieldErrors<FieldValues>) => {
    console.log(errors);
  };

  const registerOptions = {
    firstName: { required: "First name is required" },
    lastName: { required: "Last Name is required" },
    phone: { required: "phone is required" },
    email: { required: "email is required" },
  };

  return (
    <TabPanel unmount={false}>
      <Field>
        <Label>Cliente</Label>
        {customers ? (
          <Autocomplete
            selectOnFocus
            handleHomeEndKeys
            id="combo-box-demo"
            onChange={(event, newValue) => {
              if (newValue != null && newValue?.id !== 'new') {
                setSelectedCustomer(newValue);
                setValue('firstName', newValue.firstName);
                setValue('lastName', newValue.lastName);
                setValue('phone', newValue.phone);
                setValue('email', newValue.email);
              } else {
                setSelectedCustomer(null);
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
                  label: `Add new client`,
                  id: 'new'
                });
              }

              return filtered;
            }}
            isOptionEqualToValue={() => true}
            options={customers}
            renderInput={(params) => <TextField {...params} />}
            renderOption={(props, option) => <li {...props} key={option.id}>{option.label}</li>}
          />
        ) : (
          <Skeleton variant="rectangular" width={210} height={32} />
        )}
      </Field>


      <form onSubmit={handleSubmit(handleRegistration, handleError)}>

        <Field className="mt-4">
          <Label>Name</Label>
          <Controller
            name="firstName"
            defaultValue=""
            control={control}
            rules={registerOptions.firstName}
            render={({ field }) => (
              <Input {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.firstName && errors.firstName.message && (
            <small className="text-danger">
              <span>{typeof errors.firstName.message === 'string' ? errors.firstName.message : JSON.stringify(errors.firstName.message)}</span>
            </small>
          )}
        </Field>

        <Field className="mt-4">
          <Label>Last Name</Label>
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            rules={registerOptions.lastName}
            render={({ field }) => (
              <Input  {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.lastName && errors.lastName.message && (
            <small className="text-danger">
              <span>{typeof errors.lastName.message === 'string' ? errors.lastName.message : JSON.stringify(errors.lastName.message)}</span>
            </small>
          )}

        </Field>


        <Field className="mt-4">
          <Label>email</Label>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={registerOptions.email}
            render={({ field }) => (
              <Input  {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.email && errors.email.message && (
            <small className="text-danger">
              <span>{typeof errors.email.message === 'string' ? errors.email.message : JSON.stringify(errors.email.message)}</span>
            </small>
          )}

        </Field>

        <Field className="mt-4">
          <Label>phone</Label>
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            rules={registerOptions.phone}
            render={({ field }) => (
              <Input  {...field} className="border border-gray-300 p-3 block w-full rounded-lg" />
            )}
          />
          {errors?.phone && errors.phone.message && (
            <small className="text-danger">
              <span>{typeof errors.phone.message === 'string' ? errors.phone.message : JSON.stringify(errors.phone.message)}</span>
            </small>
          )}

        </Field>

        <input type="submit" className="mt-6 rounded-md bg-sky-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" />

      </form>

    </TabPanel>
  )
}

export default Step1;