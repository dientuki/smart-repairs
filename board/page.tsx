import React from 'react';
import ReactDOM from 'react-dom/client';
import Board from "./Board";
import './global.css'

const appElement = document.getElementById('app');
if (appElement) {
    ReactDOM.createRoot(appElement).render(
        <Board />
    );
}