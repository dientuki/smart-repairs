import { createFilterOptions, FilterOptionsState } from "@mui/material";
import { TabPanel } from "@headlessui/react";
import { useForm, FieldValues } from "react-hook-form";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/16/solid";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  HiddenInput,
  InputField,
  SimpleAutocomplete,
} from "@/components/form";
import { useCustomerStore, useOrderStore } from "@/store";
import { ButtonType, OperationStatus } from "@/types/enums";
import { Icon } from "../Icon";
import useErrorHandler from "@/components/hooks/useErrorHandler";
import { useState } from "react";

const filter = createFilterOptions<OptionType>();
type Step1Props = {
  nextStep: () => void;
  customers: OptionType[];
  onNext: (selectedCustomer: string) => void;
};

export const Step1 = ({ nextStep, customers, onNext }: Step1Props) => {
  const { upsertCustomer } = useCustomerStore();
  const { setCreateOrderSelectedData, clearCreateOrderSelectedData } =
    useOrderStore();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    reset,
    trigger,
    setError,
  } = useForm();
  const { handleError } = useErrorHandler();
  const [localCustomers, setLocalCustomers] = useState<OptionType[]>(customers);

  const setErrorFields = (message: Record<string, string[]>) => {
    const toValidate = ["firstname", "lastname", "phone", "email"];
    for (let i = 0, c = toValidate.length; i < c; i++) {
      if (message[`customer.${toValidate[i]}`]) {
        setError(toValidate[i], {
          message: message[`customer.${toValidate[i]}`][0],
        });
      }
    }
  };

  const isUpdatedNeeded = (data: CustomerInput): boolean => {
    const customer = localCustomers.find((c) => c.id === data.id);
    if (!customer || !customer.info || typeof customer.info === "string") {
      return true;
    }

    const customerInfo = [
      customer.info.first_name,
      customer.info.last_name,
      customer.info.phone,
      customer.info.email,
    ];

    const dataInfo = [data.firstname, data.lastname, data.phone, data.email];

    if (customerInfo.some((value, index) => value !== dataInfo[index])) {
      return true;
    }

    return false;
  };

  console.log(localCustomers);

  const handleRegistration = async (data: FieldValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (isUpdatedNeeded(data as CustomerInput)) {
        const upsertData = await upsertCustomer(data as CustomerInput);

        switch (upsertData.operation) {
          case OperationStatus.Created:
            toast.success(
              t("toast.success.add", { record: t("field.customer") }),
            );
            setLocalCustomers((prev) => [
              ...prev,
              {
                id: upsertData.customer.id,
                label: upsertData.customer.label,
                info: upsertData.customer.info,
              },
            ]);
            break;
          case OperationStatus.Updated:
            toast.success(
              t("toast.success.update", { record: t("field.customer") }),
            );
            setLocalCustomers((prev) =>
              prev.map((customer) =>
                customer.id === upsertData.customer.id
                  ? { ...customer, ...upsertData.customer }
                  : customer,
              ),
            );
            break;
          case OperationStatus.NoChange:
            break;
        }
      }
      onNext(`${data.firstname} ${data.lastname}`);
      nextStep();
    } catch (error) {
      handleError(error, setErrorFields);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleErrorForm = () => {
    toast.error(t("toast.error.form"));
  };

  const validateAtLeastOneField = (value: string) => {
    return !!getValues("phone") || !!getValues("email") || value;
  };

  const registerOptions = {
    id: { required: false },
    firstname: {
      required: t("validation.required", { field: t("field.firstname") }),
    },
    lastname: {
      required: t("validation.required", { field: t("field.lastname") }),
    },
    email: {
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t("validation.regex", { field: t("field.email") }),
      },
      validate: () =>
        validateAtLeastOneField(
          t("validation.required_without", {
            field: t("field.email"),
            another: t("field.phone"),
          }),
        ),
    },
    phone: {
      pattern: {
        value: /^\+?\d+(-\d+)*$/,
        message: t("validation.regex", { field: t("field.phone") }),
      },
      validate: () =>
        validateAtLeastOneField(
          t("validation.required_without", {
            field: t("field.phone"),
            another: t("field.email"),
          }),
        ),
    },
  };

  const handleCustomerChange = (
    newValue: OptionType | null,
    reason?: string,
  ) => {
    if (newValue && newValue.id != "new" && reason === "selectOption") {
      if (typeof newValue.info === "object" && newValue.info !== null) {
        setCreateOrderSelectedData({ customer: newValue });
        setValue("id", newValue.id);
        setValue("firstname", newValue.info.first_name);
        setValue("lastname", newValue.info.last_name);
        setValue("phone", newValue.info.phone || "");
        setValue("email", newValue.info.email || "");
        ["firstname", "lastname", "phone", "email"].forEach((field) =>
          trigger(field),
        );
      }
    }

    if (reason === "clear" || newValue?.id == "new") {
      clearCreateOrderSelectedData("customer");
      reset();
    }
  };

  const customerFilterOptions = (
    options: OptionType[],
    params: FilterOptionsState<OptionType>,
  ) => {
    const filtered = filter(options, params);

    if (params.inputValue !== "") {
      filtered.push({
        id: "new",
        label: t("combos.add", { record: t("field.customer") }),
      });
    }

    return filtered;
  };

  return (
    <TabPanel unmount={false}>
      <SimpleAutocomplete
        name='customer'
        label={t("field.customer")}
        options={localCustomers}
        isLoading={!localCustomers}
        onChange={(_, newValue, reason) =>
          handleCustomerChange(newValue, reason)
        }
        filterOptions={customerFilterOptions}
      />

      <form onSubmit={handleSubmit(handleRegistration, handleErrorForm)}>
        <HiddenInput name='id' control={control} rules={registerOptions.id} />

        <div className='grid gap-6 grid-cols-2 mt-4'>
          <InputField
            name='firstname'
            label={t("field.firstname")}
            control={control}
            rules={registerOptions.firstname}
            errors={errors}
          />

          <InputField
            name='lastname'
            label={t("field.lastname")}
            control={control}
            rules={registerOptions.lastname}
            errors={errors}
          />
        </div>

        <div className='grid gap-6 grid-cols-2 mt-4'>
          <InputField
            name='email'
            label={t("field.email")}
            control={control}
            rules={registerOptions.email}
            errors={errors}
            icon={<Icon icon={EnvelopeIcon} />}
          />

          <InputField
            name='phone'
            label={t("field.phone")}
            control={control}
            rules={registerOptions.phone}
            errors={errors}
            icon={<Icon icon={PhoneIcon} />}
          />
        </div>

        <div className='flex justify-end mt-6'>
          <ActionButton type={ButtonType.Submit} loading={isSubmitting}>
            {t("button.next")}
          </ActionButton>
        </div>
      </form>
    </TabPanel>
  );
};
