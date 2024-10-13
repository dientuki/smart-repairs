import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ApiLayerError } from "@/helper/ApiLayerError";
import { ApiLayerErrorEnum } from "@/types/enums";
import { FieldErrors, FieldValues } from "react-hook-form";

export const useErrorHandler = () => {
  const { t } = useTranslation();

  const handleError = (
    error: unknown,
    errorCallback?: (error: Record<string, string[]>) => void,
  ) => {
    console.log(error);
    if (error instanceof ApiLayerError) {
      switch (error.errorType) {
        case ApiLayerErrorEnum.Validation:
          if (
            errorCallback &&
            typeof error.message === "object" &&
            error.message !== null
          ) {
            errorCallback(error.message as Record<string, string[]>);
          }
          break;
      }
      toast.error(t(error.i18nKey || "error.bit.unexpected")); // Manejo del i18nKey si existe
    } else {
      toast.error(t("error.very.unexpected")); // Mensaje genérico para otros errores
    }
  };

  const handleErrorForm = (errors?: FieldErrors<FieldValues>) => {
    toast.error(t("toast.error.form"));
  };

  return { handleError, handleErrorForm };
};
