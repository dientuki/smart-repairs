import ReactDOM from 'react-dom/client';
import Header from "@/components/Header";
import Board from "@/components/Board";

/*
import AddButton from "@/components/AddButton";
import Modal from "@/components/Modal";
*/
import './global.css'

/*
            <Header />
            <Board />
            <AddButton />
            <Modal />
*/


const appElement = document.getElementById('app');
if (appElement) {
    ReactDOM.createRoot(appElement).render(
        <>
            <Header />
            <Board />
        </>
    );
}