import React from 'react';
import ReactDOM from 'react-dom/client';
import "react-toggle/style.css";
import './styles/default.css';
import {Tezori3} from "./components/Tezori3";
import { GlobalProvider } from './context/GlobalState';
import {HashRouter} from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
      <GlobalProvider
        isBeaconConnected={false}
        conseilUrl=''
        address={""}
        apiKey={""}
        derivationPath={""}
        network={""}
        tezosServer={""}
        beaconClient={null}
        isAddressInitialized={false}
        isLedgerConnected={false}
        isMode={false}
        signer={null}
        keyStore={null}
      >
        <HashRouter basename={"/"}>
          <Tezori3 />
        </HashRouter>
      </GlobalProvider>
);

