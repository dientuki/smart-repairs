import ReactDOM from "react-dom/client";
import { Board } from "@/components/board";
import Modal from "@/components/modal/Modal";
import { ModalContainer } from "react-modal-global";
import React, { Suspense } from "react";
import "./global.scss";
import { AddButton } from "@/components/AddButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact, { BugsnagErrorBoundary } from "@bugsnag/plugin-react";
import BugsnagPerformance from '@bugsnag/browser-performance'

let ErrorBoundary: React.ComponentType | BugsnagErrorBoundary = React.Fragment;
const appElement = document.getElementById("app");

if (appElement) {
  if (appElement.hasAttribute('data-bug')) {
    console.log('Iniciando Bugsnag');
    const apiKey = appElement.getAttribute('data-bug');

    // Inicializa Bugsnag solo en producción
    Bugsnag.start({
      apiKey: apiKey,
      plugins: [new BugsnagPluginReact()]
    });
    BugsnagPerformance.start({ apiKey: apiKey });

    // Obtén el plugin de React para crear el ErrorBoundary en producción
    const bugsnagPlugin = Bugsnag.getPlugin('react');
    ErrorBoundary = bugsnagPlugin?.createErrorBoundary(React) ?? React.Fragment;
  } else {
    console.log('No se inicia Bugsnag');
  }

  ReactDOM.createRoot(appElement).render(
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <Board />
        <AddButton />
        <Suspense>
          <ModalContainer controller={Modal} />
          <ToastContainer position='top-right' newestOnTop={false} />
        </Suspense>
      </I18nextProvider>
    </ErrorBoundary>,
  );
}
