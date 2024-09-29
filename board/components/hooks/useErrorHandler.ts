import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ApiLayerError } from "@/helper/ApiLayerError";
import { ApiLayerErrorEnum } from "@/types/enums";

const useErrorHandler = () => {
  const { t } = useTranslation();

  const handleError = (
    error: unknown,
    errorCallback?: (error: Record<string, string[]>) => void,
  ) => {
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
      toast.error(t(error.i18nKey || "error.unexpected")); // Manejo del i18nKey si existe
    } else {
      toast.error(t("error.unexpected")); // Mensaje genérico para otros errores
    }
  };

  return { handleError };
};

export default useErrorHandler;
