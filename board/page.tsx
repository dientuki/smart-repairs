import ReactDOM from "react-dom/client";
import { Board } from "@/components/board";
import Modal from "@/components/modal/Modal";
import { ModalContainer } from "react-modal-global";
import { Suspense } from "react";
import "./global.css";
import { AddButton } from "./components/AddButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const appElement = document.getElementById("app");

if (appElement) {
  ReactDOM.createRoot(appElement).render(
    <I18nextProvider i18n={i18n}>
      <Board />
      <AddButton />
      <Suspense>
        <ModalContainer controller={Modal} />
        <ToastContainer position='bottom-right' newestOnTop />
      </Suspense>
    </I18nextProvider>,
  );
}
