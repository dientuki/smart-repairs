import { createFilterOptions, FilterOptionsState } from "@mui/material";
import { TabPanel } from "@headlessui/react";
import { useForm, FieldValues, FieldErrors } from "react-hook-form";
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

const filter = createFilterOptions<OptionType>();
type Step1Props = {
  nextStep: () => void;
};

export const Step1 = ({ nextStep }: Step1Props) => {
  const { customers, updateOrCreateCustomer } = useCustomerStore();
  const { setCreateOrderSelectedData, clearCreateOrderSelectedData } =
    useOrderStore();
  const { t } = useTranslation();
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

  const handleRegistration = async (data: FieldValues) => {
    try {
      const customerStatus = await updateOrCreateCustomer(
        data as CustomerInput,
      );
      switch (customerStatus) {
        case OperationStatus.CREATED:
          toast.success("Cliente agregado");
          break;
        case OperationStatus.UPDATED:
          toast.success("Actualizo");
          break;
        case OperationStatus.NO_CHANGE:
          break;
      }
      nextStep();
    } catch (e: any) {
      const toValidate = ["firstname", "lastname", "phone", "email"];
      switch (e.constructor.name) {
        case "Object":
          for (let i = 0, c = toValidate.length; i < c; i++) {
            if (e.hasOwnProperty(`customer.${toValidate[i]}`)) {
              setError(toValidate[i], {
                message: e[`customer.${toValidate[i]}`][0],
              });
            }
          }
          toast.error("Error en el formulario");
          break;
        case "Error":
          toast.error(e.message);
          break;
        default:
          toast.error("Error!! a los botes");
          break;
      }
    }
  };

  const handleError = (_: FieldErrors<FieldValues>) => {
    toast.error("Error en el formulario");
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
        setValue("phone", newValue.info.phone);
        setValue("email", newValue.info.email);
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
        label: "Agregar nuevo cliente",
      });
    }

    return filtered;
  };

  return (
    <TabPanel unmount={false}>
      <SimpleAutocomplete
        name='customer'
        label='Cliente'
        options={customers}
        isLoading={!customers}
        onChange={(_, newValue, reason) =>
          handleCustomerChange(newValue, reason)
        }
        filterOptions={customerFilterOptions}
      />

      <form onSubmit={handleSubmit(handleRegistration, handleError)}>
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
          <ActionButton type={ButtonType.Submit}>
            Siguiente
          </ActionButton>
        </div>
      </form>
    </TabPanel>
  );
};
