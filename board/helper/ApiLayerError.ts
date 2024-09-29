import { ApiLayerErrorEnum } from "@/types/enums";

export class ApiLayerError extends Error {
  i18nKey: string;  // Clave para internacionalización
  errorType: ApiLayerErrorEnum; // Propiedad para el tipo de error

  constructor(i18nKey: string, errorType: ApiLayerErrorEnum, message?: string) {
    super(message); // Usa el mensaje proporcionado para el mensaje del Error
    this.i18nKey = i18nKey; // Asigna la clave de i18n
    this.errorType = errorType; // Asigna el tipo de error
    this.name = this.constructor.name; // Establece el nombre de la clase
    if (message) {
      this.message = message;
    }

    Object.setPrototypeOf(this, ApiLayerError.prototype); // Asegura la correcta herencia
  }
}
