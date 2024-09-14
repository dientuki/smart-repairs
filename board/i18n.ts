// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .use(LanguageDetector) // Detects user language
  .use(HttpApi) // Loads translations using HTTP
  .init({
    supportedLngs: ["en", "es"],
    fallbackLng: "es",
    detection: {
      order: [
        "htmlTag",
        "navigator",
        "queryString",
        "cookie",
        "localStorage",
        "sessionStorage",
      ],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/lang/{{lng}}.json", // Path to translation files
    },
  });

export default i18n;
