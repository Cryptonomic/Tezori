import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/default.css';
import {Tezori3} from "./components/Tezori3";
import { GlobalProvider } from './context/GlobalState';
import {HashRouter} from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
      <GlobalProvider address={""} apiKey={""} derivationPath={""} network={""} tezosServer={""} beaconClient={null} isAddressInitialized={false}>
        <HashRouter basename={"/"}>
          <Tezori3 />
        </HashRouter>
      </GlobalProvider>
);

