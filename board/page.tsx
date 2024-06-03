import ReactDOM from 'react-dom/client';
import Header from "@/components/Header";
import Board from "@/components/Board";
import Modal from "@/components/modal/Modal";
import { ModalContainer } from "react-modal-global";
import { Suspense } from "react";
import './global.css'
import ModalLayout from "@/components/modal/ModalLayout";

const appElement = document.getElementById('app');

if (appElement) {
    ReactDOM.createRoot(appElement).render(
        <>
            <Header />
            <Board />
            <Suspense>
                <ModalContainer controller={Modal} template={ModalLayout} />
            </Suspense>
        </>
    );
}