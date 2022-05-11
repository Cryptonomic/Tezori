import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/default.css';
import {Tezori3} from "./components/Tezori3";
import { GlobalProvider } from './context/GlobalState';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <GlobalProvider>
        <Tezori3 />
      </GlobalProvider>
  </React.StrictMode>
);

